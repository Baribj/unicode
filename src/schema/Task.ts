import { ObjectId } from "mongodb";
import * as Yup from "yup";
import { UserModel } from "./User";

export type TaskStatus = "toDo" | "inProgress" | "blocked" | "completed";

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export type NewTask = Pick<Task, "title" | "description" | "boardId">;

export interface PatchTask {
  status: TaskStatus;
}

export interface TaskModel
  extends Omit<Task, "id" | "boardId" | "assignee" | "createdAt"> {
  _id: ObjectId;
  boardId: ObjectId;
  assigneeId: ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AggregatedTaskModel extends TaskModel {
  assignee: UserModel;
}

export const newTaskSchema: Yup.ObjectSchema<NewTask> = Yup.object()
  .required()
  .strict()
  .noUnknown()
  .shape({
    boardId: Yup.string().required(),
    title: Yup.string().required(),
    description: Yup.string().required(),
  });

const taskStatuses: TaskStatus[] = [
  "toDo",
  "inProgress",
  "blocked",
  "completed",
];

export const patchTaskStatus: Yup.ObjectSchema<PatchTask> = Yup.object()
  .required()
  .strict()
  .noUnknown()
  .shape({
    status: Yup.string().required().oneOf(taskStatuses),
  });
