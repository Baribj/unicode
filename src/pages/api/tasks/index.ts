import { ApiFailResponse, ApiSuccessResponse } from "@/schema/ApiResponse";
import { SignUpRequest, signUpRequestSchema, UserModel } from "@/schema/User";
import { dbClientPromise, getDb } from "@/server/db";
import handleError from "@/server/utils/errorHandler";
import getSuccessResponse from "@/server/utils/response/getSuccessResponse";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import {
  AggregatedBoardModel,
  Board,
  BoardModel,
  BoardUser,
  BoardUserConnectionModel,
  BoardUserModel,
  NewBoard,
  newBoardSchema,
} from "@/schema/Board";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]"; // Adjust the path as needed
import {
  AggregatedTaskModel,
  NewTask,
  newTaskSchema,
  Task,
  TaskModel,
} from "@/schema/Task";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccessResponse | ApiFailResponse>
) {
  switch (req.method) {
    case "GET":
      return getTasks(req, res);

    case "POST":
      return postTask(req, res);
  }
}

async function getTasks(req: NextApiRequest, res: NextApiResponse) {
  try {
    const boardId = req.query.boardId;

    if (typeof boardId !== "string") {
      throw new Error();
    }

    const db = await getDb();

    const aggregatedTaskDocuments = await db
      .collection<TaskModel>("tasks")
      .aggregate<AggregatedTaskModel>([
        {
          $match: { boardId: new ObjectId(boardId) },
        },
        {
          $lookup: {
            from: "users",
            localField: "assigneeId",
            foreignField: "_id",
            as: "assignee",
          },
        },
        {
          $unwind: {
            path: "$assignee",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { _id: -1 },
        },
      ])
      .toArray();

    const tasks = aggregatedTaskDocuments.map((taskDocument) => {
      const task: Task = {
        id: taskDocument._id.toString(),
        boardId: taskDocument.boardId.toString(),
        title: taskDocument.title,
        description: taskDocument.description,
        status: taskDocument.status,
        createdAt: taskDocument.createdAt.toISOString(),
        ...(taskDocument.assignee
          ? {
              assignee: {
                id: taskDocument.assignee._id.toString(),
                name: taskDocument.assignee.name,
              },
            }
          : {}),
      };

      return task;
    });

    res.status(200).json(getSuccessResponse({}, tasks));
  } catch (err) {
    handleError(res, err);
  }
}

async function postTask(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newTask: NewTask = req.body;

    await newTaskSchema.validate(newTask);

    const db = await getDb();

    const now = new Date();

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user.id) {
      throw new Error();
    }

    await Promise.all([
      db.collection<TaskModel>("tasks").insertOne({
        _id: new ObjectId(),
        ...newTask,
        status: "toDo",
        boardId: new ObjectId(newTask.boardId),
        assigneeId: null,
        createdAt: now,
        updatedAt: now,
      }),
    ]);

    res
      .status(200)
      .json(getSuccessResponse({ detail: "Task created successfully!" }));
  } catch (err) {
    handleError(res, err);
  }
}
