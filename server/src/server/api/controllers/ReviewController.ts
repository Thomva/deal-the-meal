import { NextFunction, Request, Response } from 'express';
import { IReview, Review, User, Userrating } from '../../models/mongoose';

import { NotFoundError } from '../../utilities';

class ReviewController {
  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const reviews: Array<IReview> = await Review.find()
      .populate('item')
      .populate('assessor')
      .exec();
    return res.status(200).json(reviews);
  };

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const reviews: IReview = await Review.findById(id)
      .populate('assessor')
      .exec();
    return res.status(200).json(reviews);
  };

  public store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviewData = {
        rating: req.body.rating,
        message: req.body.message,
        _userId: req.body.assessorId,
      };

      // Find with same assessor - reveiver
      let foundReview: IReview;
      const users = await User.find();
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userrating = await Userrating.findById(user._userratingId)
          .populate('reviews')
          .exec();
        const reviews = userrating && userrating.reviews;
        const rev = reviews.find(
          (review: any) =>
            JSON.stringify(review._userId) ===
            JSON.stringify(req.body.assessorId),
        );
        if (rev) {
          foundReview = rev;
        }
      }

      let updatedReview: IReview;
      if (!!foundReview) {
        updatedReview = await Review.findByIdAndUpdate(
          foundReview._id,
          reviewData,
          { new: true },
        );
        const review = await updatedReview.save();
      } else {
        updatedReview = new Review(reviewData);
        const review = await updatedReview.save();
        const user = await User.findById(req.body.userId);
        const userrating = await Userrating.findByIdAndUpdate(
          user._userratingId,
          { $push: { _reviewIds: review._id } },
        );
        await userrating.save();
      }

      return res.status(201).json({
        updatedReview,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const { rating, message } = req.body;

      const review = await Review.findByIdAndUpdate(
        id,
        { rating, message },
        { new: true },
      );
      review.save();

      if (!review) {
        throw new NotFoundError();
      }
      return res.status(200).json(review);
    } catch (err) {
      next(err);
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let review = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          review = await Review.findById(id);
          review.remove();
          break;
        case 'softdelete':
          review = await Review.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
            { new: true },
          );
          break;
        case 'softundelete':
          review = await Review.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
            { new: true },
          );
          break;
      }

      if (!review) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Review with id: ${id}!`,
          review,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default ReviewController;
