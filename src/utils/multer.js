
import multer,{diskStorage} from 'multer';
export const multerCloudFunction = () => {
    const storage = diskStorage({})

    const multerUpload = multer({ storage })
    return multerUpload
}

