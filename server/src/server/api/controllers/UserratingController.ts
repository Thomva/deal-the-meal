import { NextFunction, Request, Response } from 'express';
import { IUserrating, Userrating } from '../../models/mongoose';

class UserratingController {
  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const userratings: Array<IUserrating> = await Userrating.find()
      .populate('reviews')
      .exec();
    return res.status(200).json(userratings);
  };

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const userratings: IUserrating = await Userrating.findById(id)
      .populate('reviews')
      .exec();
    return res.status(200).json(userratings);
  };
}

export default UserratingController;
