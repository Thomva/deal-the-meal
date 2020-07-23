import { NextFunction, Request, Response } from 'express';
import { ICategory, Category } from '../../models/mongoose';
import { NotFoundError } from '../../utilities';

class CategoryController {
  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const categories: Array<ICategory> = await Category.find().exec();
    return res.status(200).json(categories);
  };

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const categories: ICategory = await Category.findById(id).exec();
    return res.status(200).json(categories);
  };

  public store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData = {
        name: req.body.name,
      };

      const newCategory = new Category(categoryData);
      const createdCategory = newCategory.save();

      return res.status(201).json({
        createdCategory,
      });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const categoryUpdate = {
        name: req.body.name,
      };

      const category = await Category.findOneAndUpdate(
        { _id: id },
        categoryUpdate,
        {
          new: true,
        },
      );

      if (!category) {
        throw new NotFoundError();
      }
      return res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let category = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          category = await Category.findById(id);
          category.remove();
          break;
        case 'softdelete':
          category = await Category.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
            { new: true },
          );
          break;
        case 'softundelete':
          category = await Category.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
            { new: true },
          );
          break;
      }

      if (!category) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Category with id: ${id}!`,
          category,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default CategoryController;
