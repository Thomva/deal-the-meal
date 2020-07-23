import { Request, Response, NextFunction } from 'express';
import { default as passport, PassportStatic } from 'passport';
import { default as passportLocal } from 'passport-local';
import { default as passportJwt } from 'passport-jwt';
import { default as jwt } from 'jsonwebtoken';

import { Environment, IConfig } from '../config';
import { IUser, User } from '../../models/mongoose';
import { Role } from './auth.types';
import {
  UnauthorizedError,
  ForbiddenError,
  NoEmailMatchError,
  InvalidPasswordError,
} from '../../utilities';

class AuthService {
  private config: IConfig;
  public passport: PassportStatic;
  private LocalStrategy = passportLocal.Strategy;
  private ExtractJwt = passportJwt.ExtractJwt;
  private JwtStrategy = passportJwt.Strategy;

  constructor(config: IConfig) {
    this.config = config;

    this.initializeLocalStrategy();
    this.initializeJwtStrategy();
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    this.passport = passport;
  }

  private initializeLocalStrategy() {
    passport.use(
      new this.LocalStrategy(
        {
          usernameField: 'email',
        },
        async (email: string, password: string, done) => {
          try {
            const user = await User.findOne({
              email: email,
            });

            if (!user) {
              return done(new NoEmailMatchError(), false, {
                message: 'No user by that email',
              });
            }

            return user.comparePassword(
              password,
              (err: Error, isMatch: boolean) => {
                if (!isMatch) {
                  return done(new InvalidPasswordError(), false, {
                    message: 'Invalid password',
                  });
                }
                return done(null, user);
              },
            );
          } catch (error) {
            return done(error, false);
          }
        },
      ),
    );
  }

  initializeJwtStrategy = () => {
    passport.use(
      new this.JwtStrategy(
        {
          secretOrKey: this.config.auth.jwt.secret,
          jwtFromRequest: this.ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        async (jwtPayload, done) => {
          console.log(this.config.auth.jwt.secret);
          try {
            const { id } = jwtPayload;

            const user = await User.findById(id);
            if (!user) {
              return done(null, false);
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        },
      ),
    );
  };

  public createToken(user: IUser): string {
    const payload = {
      id: user._id,
    };
    console.log(this.config.auth.jwt.secret);
    return jwt.sign(payload, this.config.auth.jwt.secret, {
      expiresIn: 60 * 120,
    });
  }
}

export default AuthService;
