import { NextFunction, Request, Response } from 'express';
import { IPrice, Price } from '../../models/mongoose';

class PriceController {
  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const prices: Array<IPrice> = await Price.find().exec();
    return res.status(200).json(prices);
  };

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const price: IPrice = await Price.findById(id).exec();
    return res.status(200).json(price);
  };
}

export default PriceController;
