import { IUser } from '@app/common';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}