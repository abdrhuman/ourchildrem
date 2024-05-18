import { FoundPerson } from "../../../DB/models/foundPerson.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

// إنشاء شخص معثور عليه جديد
export const createFoundPerson = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new Error("Person image is required!"));
  const userId = req.user._id; // افترض أن معرف المستخدم متاح في req.user
  const folderName = `${process.env.FOLDER_CLOUD_NAME}/users/${userId}/found_person`;

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: folderName });

  const person = await FoundPerson.create({
    name: req.body.name,
    gender: req.body.gender,
    location: req.body.location,
    governorate: req.body.governorate,
    phone: req.body.phone,
    createdBy: req.user._id,
    imageUrl: secure_url
  });

  return res.status(201).json({ success: true, results: person });
});

// الحصول على كل الأشخاص المعثور عليهم
export const getAllFoundPersons = asyncHandler(async (req, res) => {
  const foundPersons = await FoundPerson.find();
  res.status(200).json(foundPersons);
});

// حذف شخص معثور عليه
export const deleteFoundPerson = asyncHandler(async (req, res) => {
  const foundPersonId = req.params.id;

  // البحث عن العنصر وحذفه
  const deletedPerson = await FoundPerson.findByIdAndDelete(foundPersonId);
  
  // التحقق مما إذا كان العنصر موجوداً وتم حذفه بنجاح
  if (!deletedPerson) {
    return res.status(404).json({ success: false, message: "Found person not found." });
  }

  // الرد برسالة ناجحة في حالة الحذف بنجاح
  res.status(200).json({ success: true, message: "Found person deleted successfully." });
});

// تحديث بيانات شخص معثور عليه
