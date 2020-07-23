import { NextFunction, Request, Response } from 'express';
import { IMessage, Message, User, messageSchema } from '../../models/mongoose';
import { NotFoundError } from '../../utilities';

class MessageController {
  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const messages: Array<IMessage> = await Message.find()
      .populate('sender', { firstName: 1, lastName: 1 })
      .populate('receiver', { firstName: 1, lastName: 1 })
      .populate('item', { title: 1 })
      .exec();
    return res.status(200).json(messages);
  };

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const message: IMessage = await Message.findById(id).exec();
    return res.status(200).json(message);
  };

  public store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messageCreate = new Message({
        body: req.body.body,
        _senderId: req.body.senderId,
        _receiverId: req.body.receiverId,
        _itemId: req.body.itemId,
      });
      const message = await messageCreate.save();

      const sender = await User.findById(req.body.senderId);
      const receiver = await User.findById(req.body.receiverId);

      sender._messageIds.push(message._id);
      receiver._messageIds.push(message._id);

      const updatedSender = await sender.save();
      const updatedReceiver = await receiver.save();

      return res.status(201).json({
        message,
      });
    } catch (err) {
      next(err);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const messageUpdate = {
        body: req.body.body,
        _senderId: req.body.senderId,
        _receiverId: req.body.receiverId,
        _itemId: req.body.itemId,
      };

      // Update message
      const message = await Message.findOneAndUpdate(
        { _id: id },
        messageUpdate,
        {
          new: false,
        },
      );

      // Update users
      if (
        req.body.senderId !== message._senderId &&
        req.body.senderId !== message._receiverId
      ) {
        const oldSender = await User.findByIdAndUpdate(
          req.body.senderId,
          { $pullAll: { _messageIds: [id] } },
          { new: true },
        );
        oldSender.save();
        const newSender = await User.findByIdAndUpdate(
          req.body.senderId,
          { $push: { _messageIds: id } },
          { new: true },
        );
        newSender.save();
      }
      if (
        req.body.receiverId !== message._receiverId &&
        req.body.receiverId !== message._receiverId
      ) {
        const oldReceiver = await User.findByIdAndUpdate(
          req.body.receiverId,
          { $pullAll: { _messageIds: [id] } },
          { new: true },
        );
        oldReceiver.save();
        const newReveiver = await User.findByIdAndUpdate(
          req.body.receiverId,
          { $push: { _messageIds: id } },
          { new: true },
        );
        newReveiver.save();
      }

      if (!message) {
        throw new NotFoundError();
      }
      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let currentMessage = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          currentMessage = await Message.findById(id);
          currentMessage.remove();
          break;
        case 'softdelete':
          currentMessage = await Message.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
            { new: true },
          );
          break;
        case 'softundelete':
          currentMessage = await Message.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
            { new: true },
          );
          break;
      }

      if (!currentMessage) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Message with id: ${id}!`,
          currentMessage,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default MessageController;
