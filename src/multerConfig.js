import multer from 'multer';

import path from 'path';

export const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, path.resolve('uploads'));
  },

  filename: (req, file, callback) => {
    const time = new Date().getTime();

    callback(null, `${time}_${file.originalname}`);
  },
});
