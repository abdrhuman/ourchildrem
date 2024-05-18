import express from 'express';
import { register,  login, sendForgetCode, resetPassword, profilepic, editProfile, getuserById, logout, confirmEmail } from './user.controller.js';
import { multerCloudFunction } from '../../utils/multer.js';

const userRouter = express.Router();
const fileUpload = multerCloudFunction();

// تسجيل مستخدم جديد
userRouter.post('/register', register);

// تنشيط الحساب
/*userRouter.post('/activate/:activationCode', activateAccount);*/
userRouter.route('/confirmEmail/:activationCode')
    .get(confirmEmail)
    .post(confirmEmail);

// تسجيل الدخول
userRouter.post('/login', login);

// إرسال رمز النسيان
userRouter.post('/send-forget-code', sendForgetCode);

// إعادة تعيين كلمة المرور
userRouter.post('/reset-password', resetPassword);

// تحميل صورة الملف الشخصي
userRouter.post('/profile-pic/:id', fileUpload.single('profile_pic'), profilepic);

// تعديل الملف الشخصي
userRouter.put('/edit-profile/:id',fileUpload.single("edit profile"), editProfile);

// الحصول على مستخدم بواسطة الهوية
userRouter.get('/:id', getuserById);





// تسجيل الخروج
userRouter.post('/logout', logout);

export default userRouter;
