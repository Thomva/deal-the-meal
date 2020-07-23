import { default as mongoose, Connection } from 'mongoose';
import { default as faker } from 'faker';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import {
  IMessage,
  Message,
  IUser,
  User,
  Item,
  IItem,
  Role,
  IRole,
  ICategory,
  Category,
  Price,
  IUserrating,
  Userrating,
  Review,
  ILocation,
  Location,
} from '../../models/mongoose';

class MongoDBDatabase {
  private config: IConfig;
  private logger: ILogger;
  private db: Connection;

  private categories: Array<ICategory>;
  private items: Array<IItem>;
  private roles: Array<IRole>;
  private users: Array<IUser>;

  constructor(logger: ILogger, config: IConfig) {
    this.logger = logger;
    this.config = config;

    this.categories = [];
    this.items = [];
    this.roles = [];
    this.users = [];
  }

  public connect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      mongoose
        .connect(this.config.mongoDBConnection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(data => {
          this.db = mongoose.connection;

          this.logger.info('Connected to the mongodb database', {});

          resolve(true);
        })
        .catch(error => {
          this.logger.error("Can't connect to the database", error);

          reject(error);
        });
    });
  }

  public disconnect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.db
        .close(true)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          this.logger.error("Can't disconnect the database", error);

          reject(error);
        });
    });
  }

  private messageCreate = async (
    body: string,
    sender: IUser,
    receiver: IUser,
    itemId: IItem['_id'],
  ) => {
    const messageDetail = {
      body,
      _senderId: sender._id,
      _receiverId: receiver._id,
      _itemId: itemId,
    };

    const message: IMessage = new Message(messageDetail);

    try {
      const newMessage = await message.save();
      sender._messageIds.push(newMessage._id);
      const updatedSender = await sender.save();
      receiver._messageIds.push(newMessage._id);
      const updatedReceiver = await receiver.save();

      this.logger.info(`Message created with id ${newMessage._id}`, {});
      return newMessage;
    } catch (error) {
      this.logger.error('An error occurred when creating a message', error);
    }
  };

  private createMessages = async () => {
    const promises = [];

    for (let i = 0; i < 20; i++) {
      const item: IItem = this.getRandomItem();
      let sender: IUser = null;
      let receiver: IUser = null;

      const toOwner = Math.random() >= 0.5;

      if (toOwner) {
        sender = this.getRandomUser();
        receiver = await User.findById(item._userId);
      } else {
        sender = await User.findById(item._userId);
        receiver = this.getRandomUser();
      }

      const newMessage = await this.messageCreate(
        faker.lorem.paragraph(),
        sender,
        receiver,
        item._id,
      );
      promises.push(newMessage);
    }

    return await Promise.all(promises);
  };

  private userCreate = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    locationName: string,
    _roleIds: Array<IRole['_id']>,
    showLastName?: boolean,
  ) => {
    const userrating: IUserrating = new Userrating();
    const locationDetail = {
      name: locationName,
      latitude: 10,
      longitude: 40.24,
    };
    const location: ILocation = new Location(locationDetail);

    const userDetail = {
      email,
      firstName,
      lastName,
      showLastName,
      localProvider: {
        password,
      },
      _userratingId: userrating._id,
      _roleIds,
      _locationId: location._id,
    };

    const user: IUser = new User(userDetail);

    try {
      const createdUserrating = await userrating.save();
      const createdLocation = await location.save();
      const createdUser = await user.save();
      this.users.push(createdUser);

      this.logger.info(`User created with id: ${createdUser._id}`, {});
    } catch (err) {
      this.logger.error(`An error occurred when creating a user ${err}`, err);
    }
  };

  private createUsers = async () => {
    const promises = [];
    const roles = {
      admin: await (await Role.findOne({ name: 'administrator' }))._id,
      buyer: await (await Role.findOne({ name: 'buyer' }))._id,
      seller: await (await Role.findOne({ name: 'seller' }))._id,
    };

    this.userCreate(
      this.config.admin.email,
      this.config.admin.password,
      this.config.admin.firstName,
      this.config.admin.lastName,
      this.config.admin.location,
      [roles.admin],
    );

    for (let i = 0; i < 10; i++) {
      const gender = Math.round(Math.random());
      promises.push(
        this.userCreate(
          faker.internet.email(),
          'dealthemeal!',
          faker.name.firstName(gender),
          faker.name.lastName(gender),
          faker.address.city(),
          [roles.buyer, roles.seller],
          true,
        ),
      );
    }

    return await Promise.all(promises);
  };

  private getRandomCategory = () => {
    let category: ICategory = null;
    if (this.categories && this.categories.length > 0) {
      category = this.categories[
        Math.floor(Math.random() * this.categories.length)
      ];
    }
    return category;
  };

  private getRandomUser = () => {
    let user: IUser = null;
    if (this.users && this.users.length > 0) {
      user = this.users[Math.floor(Math.random() * this.users.length)];
    }
    return user;
  };

  private getRandomItem = (userId: IUser['_id'] = null) => {
    let items: Array<IItem> = [];
    let item: IItem = null;

    if (userId) {
      items = this.items.filter(itemToTest => itemToTest._id === userId);
    } else if (this.items && this.items.length > 0) {
      items = this.items;
    }

    item = items[Math.floor(Math.random() * items.length)];
    return item;
  };

  private itemCreate = async (
    title: string,
    description: string,
    imageUrls: Array<string>,
    priceAmount: number,
    priceCurrency: string,
    user: IUser,
  ) => {
    const priceDetail = {
      amount: priceAmount,
      currency: priceCurrency,
    };

    const price = new Price(priceDetail);

    const itemDetail = {
      title,
      description,
      imageUrls,
      _categoryIds: [
        this.getRandomCategory()._id,
        this.getRandomCategory()._id,
      ],
      _priceId: price._id,
      _userId: user._id,
    };

    const item: IItem = new Item(itemDetail);

    try {
      const createdPrice = await price.save();
      const createdItem = await item.save();
      user._itemIds.push(createdItem._id);
      const updatedUser = await user.save();
      this.items.push(createdItem);

      this.logger.info(`Item created with id: ${createdItem._id}`, {});
      return createdItem;
    } catch (err) {
      this.logger.error(`An error occurred when creating a item ${err}`, err);
    }
  };

  private createItems = async () => {
    const promises = [];

    for (let i = 0; i < 10; i++) {
      const images = [];

      for (let x = 0; x < 3; x++) {
        const randomNum = Math.floor(Math.random() * 100);
        images.push(`https://picsum.photos/seed/${randomNum}/800/450`);
      }

      const item = await this.itemCreate(
        faker.lorem.sentence(3),
        faker.lorem.paragraph(6),
        images,
        Math.random() * 999,
        '€',
        this.getRandomUser(),
      );

      promises.push(item);
    }

    return await Promise.all(promises);
  };

  private categoryCreate = async (name: string) => {
    const categoryDetail = {
      name,
    };

    const category: ICategory = new Category(categoryDetail);

    try {
      const createdCategory = await category.save();
      this.categories.push(createdCategory);

      this.logger.info(`Category created with id: ${createdCategory._id}`, {});
    } catch (err) {
      this.logger.error(
        `An error occurred when creating a category ${err}`,
        err,
      );
    }
  };

  private createCategories = async () => {
    const promises = [];

    const categories = [
      'Alcoholic Beverages',
      'Non-alcoholic Beverages',
      'Fruits and Vegetables',
      'Dairy',
      'Dry Food',
      'Meat',
      'Fish',
      'Vegetarian',
      'Snacks and Sweets',
      'Bakery',
      'Ready-made Meals',
      'Preserved Goods',
      'Frozen Food',
      'Homemade',
    ];

    for (let i = 0; i < categories.length; i++) {
      promises.push(this.categoryCreate(categories[i]));
    }

    return await Promise.all(promises);
  };

  private getRandomItemsAsArrayOfIds(nItems: number) {
    const tempItems = JSON.parse(JSON.stringify(this.items)) as Array<IItem>;
    const arrayOfIds = [];
    while (arrayOfIds.length < nItems) {
      const removedItem = tempItems.splice(
        Math.floor(Math.random() * nItems),
        1,
      )[0];
      arrayOfIds.push(removedItem._id);
    }
    return arrayOfIds;
  }

  private createRole = async (name: string) => {
    const role = new Role({ name });

    try {
      const newRole = await role.save();

      this.logger.info(`Role created with id ${newRole._id}`, {});
    } catch (error) {
      this.logger.error('An error occurred when creating a role', error);
    }
  };

  private createRoles = () => {
    const promises = [
      this.createRole('administrator'),
      this.createRole('buyer'),
      this.createRole('seller'),
    ];
  };

  private createReview = async (
    rating: number,
    message: string,
    userrating: IUserrating,
  ) => {
    const review = new Review({
      rating,
      message,
      _userId: this.getRandomUser()._id,
    });

    try {
      const newReview = await review.save();
      userrating._reviewIds.push(newReview._id);
      const newUserrating = await userrating.save();

      this.logger.info(`Review created with id ${newReview._id}`, {});
      return newReview;
    } catch (error) {
      this.logger.error('An error occurred when creating a review', error);
    }
  };

  private createReviews = async () => {
    const users = await User.find().exec();

    const promises = [];

    for (let i = 0; i < users.length; i++) {
      const user = await User.findById(users[i]._id);
      const userrating = await Userrating.findById(user._userratingId);
      const reviewsAmount = Math.floor(Math.random() * 4);
      for (let x = 0; x < reviewsAmount; x++) {
        const review = await this.createReview(
          Math.floor(Math.random() * 4) + 1,
          faker.lorem.paragraph(2),
          userrating,
        );
        promises.push(review);
      }
    }

    return await Promise.all(promises);
  };

  public seed = async () => {
    this.roles = await Role.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          this.createRoles();
        }
        return Role.find().exec();
      });

    this.categories = await Category.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createCategories();
        }
        return Category.find().exec();
      });

    this.users = await User.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createUsers();
        }
        return User.find().exec();
      });

    this.items = await Item.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createItems();
        }
        return Item.find().exec();
      });

    const messages = await Message.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createMessages();
        }
        return Message.find().exec();
      });

    const reviews = await Review.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createReviews();
        }
        return Review.find().exec();
      });
  };
}

export default MongoDBDatabase;
