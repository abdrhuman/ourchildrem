import LostPerson from "../../../DB/models/lostPerson.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";

  // إنشاء شخص ضائع جديد
export const createLostPerson = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new Error("Person image is required!"));

  const userId = req.user._id; // افترض أن معرف المستخدم متاح في req.user
  const folderName = `${process.env.FOLDER_CLOUD_NAME}/users/${userId}/lost_person`;

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: folderName });

  // إنشاء مستند الشخص الضائع مع تخزين رابط الصورة
  const person = await LostPerson.create({
    name: req.body.name,
    gender: req.body.gender,
    location: req.body.location,
    phone: req.body.phone,
    createdBy: req.user._id,
    imageUrl: secure_url 
  });

  res.status(201).json({ success: true, results: person });
});


export const getAllLostPersons = asyncHandler(async (req, res) => {
  const lostPersons = await LostPerson.find();
  res.status(200).json(lostPersons);
});


