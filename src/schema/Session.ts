import { ObjectId } from "mongodb";

export interface SessionModel {
  _id: ObjectId;
  userId: ObjectId;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
