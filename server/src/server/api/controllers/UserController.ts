import { NextFunction, Request, Response } from 'express';
import {
  User,
  IUser,
  Userrating,
  Item,
  IItem,
  Role,
  IRole,
  Message,
  Location,
} from '../../models/mongoose';

import { AuthService, IConfig, Logger } from '../../services';
import { NotFoundError } from '../../utilities';
import { isString } from 'util';

class UserController {
  private authService: AuthService;
  private config: IConfig;

  constructor(config: IConfig, authService: AuthService) {
    this.config = config;
    this.authService = authService;
  }

  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    try {
      const { limit, skip, ids, email } = req.query;
      let users = null;
      const filters: {
        email?: IUser['email'];
        _id?: object;
      } = {};
      if (isString(ids) && ids != '') filters._id = { $in: JSON.parse(ids) };
      if (isString(email) && email != '') filters.email = email;
      users = await User.find(filters)
        .sort({ created_at: -1 })
        .populate({
          path: 'userrating',
          populate: {
            path: 'reviews',
          },
        })
        .populate('roles', { name: 1 })
        .populate('items', { title: 1 })
        .populate('location')
        .exec();

      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id)
        .populate('items')
        .populate('messages')
        .populate('location')
        .populate({
          path: 'userrating',
          populate: {
            path: 'reviews',
            populate: {
              path: 'assessor',
            },
          },
        })
        .exec();
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let userUpdate: {
        firstName?: any;
        lastName?: any;
        showLastName?: any;
        email?: any;
        _roleIds?: any;
        localProvider?: any;
      } = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        showLastName: req.body.showLastName,
      };
      if (req.body.email) userUpdate.email = req.body.email;
      if (req.body.roleIds) userUpdate._roleIds = req.body.roleIds;
      if (req.body.password)
        userUpdate.localProvider = {
          password: req.body.roleIds,
        };

      const user = await User.findOneAndUpdate({ _id: id }, userUpdate, {
        new: true,
      }).exec();

      if (req.body.location) {
        const updatedLocation = await Location.findByIdAndUpdate(user._locationId, req.body.location, {
          new: true,
        }).exec();
        console.log(updatedLocation);
      }

      if (!user) {
        throw new NotFoundError();
      }
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let user = null;
      let userrating = null;
      let items: Array<IItem> = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          user = await User.findById(id)
            .populate('messages')
            .populate('items');
          // Remove messages
          let messages: Array<any>;
          messages = user.messages;
          if (messages) {
            for (let i = 0; i < messages.length; i++) {
              const message = messages[i];
              await message.remove();
            }
          }

          // Remove items
          items = user.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              await item.remove();
            }
          }

          await user.remove();
          break;
        case 'softdelete':
          user = await User.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
          );
          userrating = await Userrating.findByIdAndUpdate(user._userratingId, {
            _deletedAt: Date.now(),
          });
          items = await Item.find({ _userId: id });
          for (let i = 0; i < items.length; i++) {
            items[i].update({ _deletedAt: Date.now() });
            await items[i].save();
          }
          break;
        case 'softundelete':
          user = await User.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
          );
          userrating = await Userrating.findByIdAndUpdate(user._userratingId, {
            _deletedAt: null,
          });
          items = await Item.find({ _userId: id });
          for (let i = 0; i < items.length; i++) {
            items[i].update({ _deletedAt: null });
            await items[i].save();
          }
          break;
      }

      if (!user) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the User with id: ${id}!`,
          user,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };

  public store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        showLastName,
        location,
        roleIds,
      } = req.body;

      let foundUser = await User.findOne({ email: email });
      if (foundUser) {
        return res.status(403).json({ error: 'Email is already in use' });
      }

      const newUserrating = new Userrating();
      const userrating = await newUserrating.save();

      const newUser: IUser = new User({
        email,
        firstName,
        lastName,
        showLastName,
        location,
        localProvider: {
          password,
        },
        _userratingId: userrating._id,
        _roleIds: roleIds,
      });

      const user: IUser = await newUser.save();

      const token = this.authService.createToken(user);
      let roleNames: Array<IRole['name']> = [];
      for (let i = 0; i < user._roleIds.length; i++) {
        const role: IRole = await Role.findById(user._roleIds[i]);
        roleNames.push(role.name);
      }
      return res.status(200).json({
        id: user.id,
        email: user.email,
        token: `${token}`,
        strategy: 'local',
        roles: roleNames,
      });
    } catch (err) {
      next(err);
    }
  };

  signupLocal = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    const { email, password, firstName, lastName, location } = req.body;

    try {
      let foundUser = await User.findOne({ email: email });
      if (foundUser) {
        return res.status(403).json({ error: 'Email is already in use' });
      }

      const buyerRole = await Role.findOne({ name: 'buyer' });
      const sellerRole = await Role.findOne({ name: 'seller' });

      const newUserrating = new Userrating();
      const userrating = await newUserrating.save();

      const newLocation = new Location(location);
      console.log('location:', location);
      const loc = await newLocation.save();

      const newUser: IUser = new User({
        email,
        firstName,
        lastName,
        localProvider: {
          password,
        },
        _userratingId: userrating._id,
        _roleIds: [buyerRole._id, sellerRole._id],
        _locationId: loc._id,
      });

      const user: IUser = await newUser.save();

      const token = this.authService.createToken(user);
      let roleNames: Array<IRole['name']> = [];
      for (let i = 0; i < user._roleIds.length; i++) {
        const role: IRole = await Role.findById(user._roleIds[i]);
        roleNames.push(role.name);
      }
      return res.status(200).json({
        id: user.id,
        email: user.email,
        token: `${token}`,
        strategy: 'local',
        roles: roleNames,
      });
    } catch (err) {
      next(err);
    }
  };

  loginLocal = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    this.authService.passport.authenticate(
      'local',
      { session: this.config.auth.jwt.session },
      async (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new NotFoundError());
        }
        const token = this.authService.createToken(user);
        let roleNames: Array<IRole['name']> = [];
        for (let i = 0; i < user._roleIds.length; i++) {
          const role: IRole = await Role.findById(user._roleIds[i]);
          roleNames.push(role.name);
        }
        return res.status(200).json({
          id: user.id,
          email: user.email,
          token: `${token}`,
          strategy: 'local',
          roles: roleNames,
          // itemIds: user._itemIds,
        });
      },
    )(req, res, next);
  };

  verifyAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const roles = await Role.find();
      const adminRoleId = roles.find(r => r.name === 'administrator')._id;
      const user = await User.findById(req.body.userId);
      const isAdmin = user._roleIds.includes(adminRoleId);
      return res.status(200).json({ isAdmin: isAdmin });
    } catch (err) {
      next(err);
    }
  };
}

export default UserController;
