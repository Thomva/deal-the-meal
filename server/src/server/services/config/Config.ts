import { default as dotenv } from 'dotenv';

import {
  Environment,
  IConfig,
  IServerConfig,
  ServerProtocol,
  IAuthConfig,
  IFacebookConfig,
  IJwtConfig,
} from './config.types';
import { IUser } from 'src/server/models/mongoose';

class Config implements IConfig {
  public docs: boolean;
  public env: Environment;
  public server: IServerConfig;
  public mongoDBConnection: string;
  public auth: IAuthConfig;
  public admin: any;

  constructor() {
    dotenv.config();
    this.loadEnvironmentVariables();
  }

  private loadEnvironmentVariables(): void {
    this.docs = Boolean(process.env.NODE_DOCS || false);
    this.env =
      Environment[
        (process.env.NODE_ENV ||
          Environment.development) as keyof typeof Environment
      ];
    this.server = {
      host: process.env.NODE_SERVER_HOST || 'localhost',
      port: Number(process.env.NODE_SERVER_PORT || 8080),
      protocol:
        ServerProtocol[
          (process.env.NODE_SERVER_PROTOCOL ||
            ServerProtocol.http) as keyof typeof ServerProtocol
        ],
    } as IServerConfig;
    this.mongoDBConnection = process.env.MONGODB_CONNECTION;
    this.auth = {
      bcryptSalt: Number(process.env.AUTH_BCRYPT_SALT || 10),
      jwt: {
        secret: process.env.AUTH_JWT_SECRET || 'dealthemeal_d1f65s1dsdfhn',
        session: Boolean(process.env.AUTH_JWT_SESSION || true),
      },
    };
    this.admin = {
      email: process.env.ADMIN_EMAIL || 'admin@admin.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123',
      firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.ADMIN_LAST_NAME || 'Adminson',
      location: process.env.ADMIN_LOCATION || 'Gent',
    };
  }
}

export default Config;
