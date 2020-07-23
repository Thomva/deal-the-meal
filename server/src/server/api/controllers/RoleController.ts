import { NextFunction, Request, Response } from 'express';
import { IRole, Role } from '../../models/mongoose';
import { NotFoundError } from '../../utilities';

class RoleController {
  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const roles: Array<IRole> = await Role.find().exec();
    return res.status(200).json(roles);
  };

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const roles: IRole = await Role.findById(id).exec();
    return res.status(200).json(roles);
  };

  public store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleData = {
        name: req.body.name,
      };

      const newRole = new Role(roleData);
      const createdRole = newRole.save();

      return res.status(201).json({
        createdRole,
      });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const roleUpdate = {
        name: req.body.name,
      };

      const role = await Role.findOneAndUpdate({ _id: id }, roleUpdate, {
        new: true,
      });

      if (!role) {
        throw new NotFoundError();
      }
      return res.status(200).json(role);
    } catch (err) {
      next(err);
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let role = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          role = await Role.findById(id);
          role.remove();
          break;
        case 'softdelete':
          role = await Role.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
            { new: true },
          );
          break;
        case 'softundelete':
          role = await Role.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
            { new: true },
          );
          break;
      }

      if (!role) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Role with id: ${id}!`,
          role,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default RoleController;
