import { ObjectId } from "mongodb";
import * as Yup from "yup";

export const boardTypes = [
  "product" as const,
  "design" as const,
  "engineering" as const,
  "qa" as const,
];

export interface Board {
  id: string;
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
  };
  type: "product" | "design" | "engineering" | "qa";
  createdAt: string;
}

export type NewBoard = Omit<Board, "id" | "user" | "createdAt">;

export interface BoardModel extends Omit<Board, "id" | "owner" | "createdAt"> {
  id: ObjectId;
  userId: ObjectId;
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
