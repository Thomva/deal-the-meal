import multer from 'multer';
import { mkdirSync, existsSync } from 'fs';

class MulterMiddleware {
  private storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const path = './uploads';
      !existsSync(path) && mkdirSync(path);
      cb(null, path);
    },
    filename: (req: any, file: any, cb: any) => {
      const name = Date.now() + file.originalname;
      cb(null, name);
    },
  });

  private fileFilter = (req: any, file: any, cb: any) => {
    if (
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Image uploaded is not of type jpg/jpeg or png'), false);
    }
  };

  private limits = {
    fileSize: 1024 * 500,
  };

  public upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
    limits: this.limits,
  });
}

export default MulterMiddleware;
