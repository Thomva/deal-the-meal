import {
  default as express,
  Application,
  Request,
  Response,
  Router,
  NextFunction,
} from 'express';
import { IConfig, AuthService, Role, Logger } from '../../services';
import {
  CategoryController,
  HelloController,
  ItemController,
  MessageController,
  PriceController,
  ReviewController,
  RoleController,
  UploadsController,
  UserController,
  UserratingController,
} from '../controllers';
import MulterMiddleware from '../../middleware/multer';

class ApiRouter {
  public router: Router;
  private categoryController: CategoryController;
  private helloController: HelloController;
  private itemController: ItemController;
  private messageController: MessageController;
  private priceController: PriceController;
  private reviewController: ReviewController;
  private roleController: RoleController;
  private uploadsController: UploadsController;
  private userController: UserController;
  private userratingController: UserratingController;

  private config: IConfig;
  private authService: AuthService;

  private multer: MulterMiddleware;

  constructor(
    config: IConfig,
    authService: AuthService,
    multer: MulterMiddleware,
  ) {
    this.config = config;
    this.authService = authService;
    this.multer = multer;

    this.router = express.Router();

    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers(): void {
    this.categoryController = new CategoryController();
    this.helloController = new HelloController();
    this.itemController = new ItemController();
    this.messageController = new MessageController();
    this.priceController = new PriceController();
    this.reviewController = new ReviewController();
    this.roleController = new RoleController();
    this.uploadsController = new UploadsController();
    this.userController = new UserController(this.config, this.authService);
    this.userratingController = new UserratingController();
  }

  private registerRoutes(): void {
    /*
     * Hello routes
     */
    this.router.get('/hello', this.helloController.index);
    /*
     * Message routes
     */
    this.router.get('/messages', this.messageController.index);
    this.router.get('/messages/:id', this.messageController.show);
    this.router.post('/messages', this.messageController.store);
    this.router.put('/messages/:id', this.messageController.update);
    this.router.delete('/messages/:id', this.messageController.destroy);
    /**
     * Category routes
     */
    this.router.get('/categories', this.categoryController.index);
    this.router.get('/categories/:id', this.categoryController.show);
    this.router.post('/categories', this.categoryController.store);
    this.router.put('/categories/:id', this.categoryController.update);
    this.router.delete('/categories/:id', this.categoryController.destroy);
    /*
     * Item routes
     */
    this.router.get('/items', this.itemController.index);
    this.router.get('/items/create', this.itemController.create); // Must be before the route /items/:id
    this.router.get('/items/:id', this.itemController.show);
    this.router.post(
      '/items',
      this.multer.upload.array('images', 20),
      this.itemController.store,
    ); // Possible image upload
    this.router.get('/items/:id/edit', this.itemController.edit);
    this.router.put(
      '/items/:id',
      this.multer.upload.array('images', 20),
      this.itemController.update,
    ); // Possible image upload
    this.router.delete('/items/:id', this.itemController.destroy);
    /*
     * User routes
     */
    this.router.get('/users', this.userController.index);
    this.router.get('/users/:id', this.userController.show);
    this.router.delete('/users/:id', this.userController.destroy);
    this.router.put('/users/:id', this.userController.update);
    this.router.post('/users', this.userController.store);
    this.router.post('/auth/login/', this.userController.loginLocal);
    this.router.post('/auth/signup/', this.userController.signupLocal);
    this.router.post('/auth/isadmin/', this.userController.verifyAdmin);
    /*
     * Userrating routes
     */
    this.router.get('/userratings', this.userratingController.index);
    this.router.get('/userratings/:id', this.userratingController.show);
    /*
     * Review routes
     */
    this.router.get('/reviews', this.reviewController.index);
    this.router.get('/reviews/:id', this.reviewController.show);
    this.router.post('/reviews', this.reviewController.store);
    this.router.put('/reviews/:id', this.reviewController.update);
    this.router.delete('/reviews/:id', this.reviewController.destroy);
    /**
     * Price routes
     */
    this.router.get('/prices', this.priceController.index);
    this.router.get('/prices/:id', this.priceController.show);
    /**
     * Role routes
     */
    this.router.get('/roles', this.roleController.index);
    this.router.get('/roles/:id', this.roleController.show);
    this.router.post('/roles', this.roleController.store);
    this.router.put('/roles/:id', this.roleController.update);
    this.router.delete('/roles/:id', this.roleController.destroy);
    /**
     * Uploads access routes
     */
    this.router.get('/uploads/:filename', this.uploadsController.show);
  }
}

export default ApiRouter;
