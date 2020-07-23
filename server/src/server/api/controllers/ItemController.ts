import { NextFunction, Request, Response } from 'express';
import {
  IItem,
  Item,
  Category,
  Price,
  User,
  IUser,
  Message,
} from '../../models/mongoose';

import { NotFoundError } from '../../utilities';
import { isString, isArray } from 'util';
import { unlink, unlinkSync, existsSync } from 'fs';

class ItemController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        limit,
        skip,
        sortBy,
        title,
        category,
        location,
        userId,
        showDeleted,
        ids,
      } = req.query;
      let items;
      let sort = sortBy ? JSON.parse(sortBy) : { _createdAt: -1 };
      const filters: {
        title?: object;
        _id?: object;
        _categoryIds?: object;
        _userId?: IUser['_id'];
        _deletedAt?: object;
        location?: any;
      } = {};
      if (isString(title)) filters.title = { $regex: title, $options: 'i' };
      if (isString(category) && category != '-1')
        filters._categoryIds = { $all: [category] };
      if (isString(userId) && userId != '') filters._userId = userId;
      if (!isString(showDeleted) || showDeleted == '')
        filters._deletedAt = { $eq: null };
      if (isString(ids) && ids != '') filters._id = { $in: JSON.parse(ids) };
      console.log(location);

      if (limit && skip) {
        const options = {
          limit: parseInt(limit, 10) || 10,
          page: parseInt(skip, 10) || 1,
          sort: sort,
          populate: ['categories', 'price', {
            path: 'user',
            populate: {
              path: 'location',
            }
          }],
        };
        items = await Item.paginate(filters, options);
      } else {
        items = await Item.find(filters)
          .populate('categories')
          .populate('price')
          .populate({
            path: 'user',
            populate: {
              path: 'location',
            }
          })
          .sort(sort)
          .exec();
      }
      return res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const item = await Item.findById(id)
        .populate('categories')
        .populate('price')
        .populate({
          path: 'user',
          populate: {
            path: 'userrating',
            populate: 'reviews',
          },
        })
        .populate({
          path: 'user',
          populate: {
            path: 'location',
          },
        })
        .exec();
      return res.status(200).json(item);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vm = {
        categories: await Category.find(),
      };
      return res.status(200).json(vm);
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create Price
      const priceCreate = new Price({
        amount: req.body.priceAmount,
        currency: req.body.priceCurrency,
      });
      const price = await priceCreate.save();

      // Get all urls
      const order = isArray(req.body.order) ? req.body.order : [req.body.order];

      const files = req.files;
      const folder = 'uploads/';
      const fileNames = isArray(files) && files.map(file => file.filename);
      const filePaths =
        isArray(fileNames) && fileNames.map(fileName => folder + fileName);
      const bodyImageUrls: Array<any> = req.body.imageUrls;
      let imageUrls: Array<any> = [];
      if (bodyImageUrls)
        imageUrls = isArray(bodyImageUrls) ? bodyImageUrls : [bodyImageUrls];

      let orderedImageUrls: Array<any> = [];
      if (!order || order.length < 1 || order.includes(undefined)) {
        orderedImageUrls.push(...imageUrls);
        orderedImageUrls.push(...filePaths);
      } else {
        order.forEach((isNewImg: any) => {
          const toPush =
            isNewImg === 'true' ? filePaths.shift() : imageUrls.shift();
          orderedImageUrls.push(toPush);
        });
      }

      // Set new item
      const itemCreate = new Item({
        title: req.body.title,
        description: req.body.description,
        imageUrls: orderedImageUrls,
        _categoryIds: req.body._categoryIds,
        _priceId: price._id,
        _userId: req.body._userId,
      });
      const item = await itemCreate.save();

      // Update user
      const user = await User.findById(req.body._userId);
      user._itemIds.push(item._id);
      const updatedUser = await user.save();

      return res.status(201).json({
        item,
        price,
      });
    } catch (err) {
      next(err);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const item = await Item.findById(id).exec();

      if (!item) {
        throw new NotFoundError();
      } else {
        const vm = {
          item,
          categories: await Category.find(),
        };
        return res.status(200).json(vm);
      }
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const oldItem = await Item.findById(id).exec();

      // Update Price
      const priceUpdate = {
        amount: req.body.priceAmount,
        currency: req.body.priceCurrency,
      };
      const price = await Price.findOneAndUpdate(
        { _id: oldItem._priceId },
        priceUpdate,
        {
          new: true,
        },
      ).exec();

      // Get all urls
      const order = isArray(req.body.order) ? req.body.order : [req.body.order];

      const files = req.files;
      const folder = 'uploads/';
      const fileNames = isArray(files) && files.map(file => file.filename);
      const filePaths =
        isArray(fileNames) && fileNames.map(fileName => folder + fileName);
      const bodyImageUrls: Array<any> = req.body.imageUrls;
      let imageUrls: Array<any> = [];
      if (bodyImageUrls)
        imageUrls = isArray(bodyImageUrls) ? bodyImageUrls : [bodyImageUrls];

      let orderedImageUrls: Array<any> = [];
      if (!order || order.length < 1 || order.includes(undefined)) {
        orderedImageUrls.push(...imageUrls);
        orderedImageUrls.push(...filePaths);
      } else {
        order.forEach((isNewImg: any) => {
          const toPush =
            isNewImg === 'true' ? filePaths.shift() : imageUrls.shift();
          orderedImageUrls.push(toPush);
        });
      }

      // Set updated item
      const itemUpdate = {
        title: req.body.title,
        description: req.body.description,
        imageUrls: orderedImageUrls,
        _categoryIds: req.body._categoryIds,
      };

      // Delete images
      const imageUrlsToDelete: Array<any> = isArray(req.body.imageUrlsToDelete)
        ? req.body.imageUrlsToDelete
        : [req.body.imageUrlsToDelete];

      imageUrlsToDelete.forEach(url => {
        if (url && existsSync(url)) {
          unlinkSync(url);
        }
      });

      // Update Item
      const item = await Item.findOneAndUpdate({ _id: id }, itemUpdate, {
        new: true,
      })
        .populate('categories')
        .populate('price')
        .populate('user')
        .exec();

      if (!item) {
        throw new NotFoundError();
      }
      return res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let item = null;
      let price = null;
      let messages = [];
      let owner = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          item = await Item.findById(id);
          item.remove();
          break;
        case 'softdelete':
          item = await Item.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
            { new: true },
          ).populate('user');
          price = await Price.findByIdAndUpdate(
            { _id: item._priceId },
            { _deletedAt: Date.now() },
          );
          break;
        case 'softundelete':
          item = await Item.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
            { new: true },
          ).populate('user');
          price = await Price.findByIdAndUpdate(
            { _id: item._priceId },
            { _deletedAt: null },
          );
          break;
      }

      if (!item) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Item with id: ${id}! (And it's Price)`,
          item,
          price,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default ItemController;
