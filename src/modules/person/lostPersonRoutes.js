import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import { lostPersonSchema } from "./lostPersonValidation.js"; // استيراد مخطط التحقق من البيانات لـ lostPerson
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { createLostPerson, getAllLostPersons } from "./lostPersonController.js"; // استيراد دالة إنشاء شخص ضائع

import { multerCloudFunction } from "../../utils/multer.js"; // استيراد multerCloudFunction و allowedExtensions


const router = Router();
const fileUpload = multerCloudFunction(); // استخدام multerCloudFunction لتهيئة تحميل الملفات

// مسار إنشاء شخص ضائع جديد
router.post("/LostPerson", isAuthenticated, isAuthorized('user'), fileUpload.single('image'), isValid(lostPersonSchema), createLostPerson); // استخدام fileUpload.single('image') لتحميل ملف الصورة فقط

router.get('/getLost', getAllLostPersons);

export default router;
