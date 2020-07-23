import { NextFunction, Request, Response } from 'express';

class UploadsController {
  public show = async (
    req: Request,
    res: any,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { filename } = req.params;
    const filePath: string = `./uploads/${filename}`;
    return res.status(200).sendfile(filePath);
  };
}

export default UploadsController;
