import { ObjectId } from "mongodb";
import * as Yup from "yup";

export const boardTypes = [
  "product" as const,
  "design" as const,
  "engineering" as const,
  "qa" as const,
];

export type BoardUserRole = "owner" | "contributor";

export interface BoardUser {
  name: string;
  role: BoardUserRole;
}

export interface BoardUserModel extends BoardUser {
  _id: ObjectId;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  users: BoardUser[];
  type: "product" | "design" | "engineering" | "qa";
  createdAt: string;
}

export type NewBoard = Omit<Board, "id" | "users" | "createdAt">;

export interface BoardModel extends Omit<Board, "id" | "users" | "createdAt"> {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const newBoardSchema: Yup.ObjectSchema<NewBoard> = Yup.object()
  .required()
  .strict()
  .noUnknown()
  .shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
    type: Yup.string().required().oneOf(boardTypes),
  });

export interface BoardUserConnectionModel {
  _id: ObjectId;
  boardId: ObjectId;
  userId: ObjectId;
  role: BoardUserRole; // Ideally, this should use roleID and we should have a reference collection / table for Roles.
  createdAt: Date;
  updatedAt: Date;
}

export interface AggregatedBoardModel extends BoardModel {
  users: BoardUserModel[];
}
