// استيراد الحزم والمكتبات الضرورية
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../../DB/models/user.model.js";
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from "../../utils/sendEmail.js";
import { forgetCodeTemp, signUpTemp } from "../../utils/emailTemplehtml.js";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import randomstring from "randomstring";
import cloudinary from "../../utils/cloud.js";

// تسجيل مستخدم جديد
export const register = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;
    // التحقق مما إذا كان البريد الإلكتروني مسجل بالفعل
    const isUser = await User.findOne({ email });
    if (isUser) return next(new Error("Email already registered!", { cause: 409 }));

    if (!password) {
        return next(new Error('Password is required!'));
    }
    const hashPassword = bcryptjs.hashSync(password, Number(process.env.SALT_ROUND) || 10);
    
    const activationCode = crypto.randomBytes(64).toString("hex");

    // إنشاء مستخدم جديد في قاعدة البيانات
    const user = await User.create({
        userName,
        email,
        password: hashPassword,
        activationCode,

    });

    // إنشاء رابط التنشيط
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${activationCode}`;
    // إرسال رسالة البريد الإلكتروني لتنشيط الحساب
    const isSent = await sendEmail({ to: email, subject: "Activation Account", html: signUpTemp(link) });

    // الرد بنجاح إذا تم إرسال البريد الإلكتروني بنجاح
    return isSent ? res.json({ success: true, message: 'Please review your email' }) : next(new Error('Something went wrong!'));
});

// تنشيط الحساب
export const confirmEmail = asyncHandler(async (req, res) => {
    // استخراج رمز التنشيط من معلمة الطلب (التي تم تمريرها كجزء من الرابط)
    const activationCode = req.params.activationCode;

    // البحث عن المستخدم باستخدام رمز التنشيط
    const user = await User.findOneAndUpdate(
        { activationCode: activationCode }, // تحديد الوثيقة باستخدام رمز التنشيط
        { $set: { isConfirmed: true }, $unset: { activationCode: 1 } }, // تعيين حالة التأكيد وإزالة رمز التنشيط من الوثيقة
        { new: true } // خيار لإرجاع الوثيقة المحدثة بعد التحديث
    );
    

    // التحقق مما إذا كان المستخدم موجودًا وتم تأكيد حسابه
    if (!user) {
        return res.status(404).json({ success: false, message: "Invalid activation code or account already activated" });
    }

    // رسالة تأكيد تنشيط الحساب بنجاح
    return res.status(200).json({ success: true, message: "تم تأكيد البريد الإلكتروني بنجاح" });
});



// تسجيل الدخول
export const login = asyncHandler(async (req, res, next) => {
    
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Invalid email or password!", { cause: 404 }));

    if (!user.isConfirmed) return next(new Error('Unactivated account!', { cause: 404 }));

    const match = bcryptjs.compareSync(password, user.password);
    if (!match) return next(new Error('Invalid Password!', { cause: 404 }));

    
    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: "2d" });
    
    await Token.create({
        token: jwtToken,
        user: user._id,
        agent: req.headers['user-agent']
    });

    
    user.status = "online";
    await user.save();

    return res.json({ success: true, results: jwtToken });
});

// إرسال رمز النسيان
export const sendForgetCode = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new Error("Invalid Email"));

    const code = randomstring.generate({
        length: 5,
        charset: "numeric",
    });
    user.forgetCode = code;
    await user.save();
    return sendEmail({
        to: user.email,
        subject: 'Reset Password',
        html: forgetCodeTemp(code),
    }) ? res.json({ success: true, message: "Check your Email" }) : next(new Error("Something went wrong"))
});

// إعادة تعيين كلمة المرور
export const resetPassword = asyncHandler(async (req, res, next) => {
    let user = await User.findOne({ forgetCode: req.body.forgetCode });
    if (!user) return next(new Error("Invalid code!"));

    
    user.password = bcryptjs.hashSync(
        req.body.password,
        Number(process.env.SALT_ROUND)
    );

    await user.save();

    const token = await Token.find({ user: user._id });

    token.forEach(async (token) => {
        token.isValid = false;
        await token.save();
    });

    return res.json({ success: true, message: "try to login  !" });
});

// استيراد صورة الملف الشخصي
export const profilepic = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (!req.file) return next(new Error("Person image is required!"));

    const folderName = `${process.env.FOLDER_CLOUD_NAME}/${process.env.FOLDER_CLOUD_NAME2}/${id}/picture`;

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: folderName });

    const user = await User.findByIdAndUpdate(id, { profile_pic: { secure_url, public_id } }, { new: true });

    if (!user) {
        return res.status(404).json({ cause: 404, message: "User not found" });
    }

    return res.json({ message: "Done", user });
});


// تعديل الملف الشخصي
export const editProfile = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!req.file) return next(new Error("Person image is required!"));
    const folderName = `${process.env.FOLDER_CLOUD_NAME}/${process.env.edit_pic}/${id}/editpicture`;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: folderName });


    const user = await User.findByIdAndUpdate(id, { edit_pic: { secure_url, public_id } }, { new: true });

    if (!user) {
        return res.status(404).json({ cause: 404, message: "User not found" });
    }

    return res.status(200).json({ message: 'Profile updated successfully', user });
});



// الحصول على مستخدم بواسطة الهوية
export const getuserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const folderName = `${process.env.FOLDER_CLOUD_NAME}/users/${id}`;
    const profileImageUrl = `${process.env.FOLDER_CLOUD_NAME}/${process.env.FOLDER_CLOUD_NAME2}/${id}`;

    // استعلام Cloudinary للحصول على الصورة البروفايل
    cloudinary.api.resources({ type: 'upload', prefix: profileImageUrl }, function(error, profileImageResult) {
        if (error) {
            return next(new Error("Failed to retrieve user's profile image from Cloudinary"));
        }
        
        // استعلام Cloudinary للحصول على جميع الملفات في مجلد المستخدم
        cloudinary.api.resources({ type: 'upload', prefix: folderName }, function(error, imagesResult) {
            if (error) {
                return next(new Error("Failed to retrieve user's files from Cloudinary"));
            }
            
            // استخراج روابط الصور وإرجاعها مع معلومات المستخدم
            const profileimage = profileImageResult.resources.map(resource => resource.secure_url);
            const images = imagesResult.resources.map(resource => resource.secure_url);
            return res.json({ message: 'Done', user: { ...user.toObject(), profileImage: { url: profileimage }, images } });
        });
    });
});


// حذف مستخدم

// تسجيل الخروج
export const logout = asyncHandler(async (req, res, next) => {
    const userId = req.body.userId;

    // تحقق من أن المستخدم موجود
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // تحديث حالة المستخدم إلى offline
    user.status = 'offline';
    await user.save();

    // إبطال جميع التوكنات المتعلقة بالمستخدم
    await Token.updateMany({ user: userId }, { isValid: false });

    // رد بتأكيد تسجيل الخروج
    return res.status(200).json({ success: true, message: 'Logout successful' });
});







