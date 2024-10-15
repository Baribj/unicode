import { ApiFailResponse, ApiSuccessResponse } from "@/schema/ApiResponse";
import { dbClientPromise, getDb } from "@/server/db";
import handleError from "@/server/utils/errorHandler";
import getSuccessResponse from "@/server/utils/response/getSuccessResponse";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  AggregatedBoardModel,
  Board,
  BoardModel,
  BoardUser,
  BoardUserConnectionModel,
  NewBoard,
  newBoardSchema,
} from "@/schema/Board";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccessResponse | ApiFailResponse>
) {
  switch (req.method) {
    case "GET":
      return getBoards(req, res);

    case "POST":
      return postBoard(req, res);
  }
}

async function getBoards(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDb();

    const aggregatedBoardDocuments = await db
      .collection<BoardModel>("boards")
      .aggregate<AggregatedBoardModel>([
        {
          $lookup: {
            from: "boardsUsers",
            localField: "_id",
            foreignField: "boardId",
            as: "boardUsers",
          },
        },
        {
          $unwind: "$boardUsers",
        },
        {
          $lookup: {
            from: "users",
            localField: "boardUsers.userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            description: { $first: "$description" },
            type: { $first: "$type" },
            createdAt: { $first: "$createdAt" },
            users: {
              $push: {
                name: "$userDetails.name",
                email: "$userDetails.email",
                role: "$boardUsers.role",
              },
            },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $limit: 30,
        },
      ])
      .toArray();

    const boards = aggregatedBoardDocuments.map((boardDocument) => {
      const board: Board = {
        id: boardDocument._id.toString(),
        title: boardDocument.title,
        description: boardDocument.description,
        type: boardDocument.type,
        createdAt: boardDocument.createdAt.toISOString(),
        users: boardDocument.users.map((userDocument) => {
          const user: BoardUser = {
            name: userDocument.name,
            role: userDocument.role,
          };

          return user;
        }),
      };
      return board;
    });

    res.status(200).json(getSuccessResponse({}, boards));
  } catch (err) {
    handleError(res, err);
  }
}

async function postBoard(req: NextApiRequest, res: NextApiResponse) {
  const dbClient = await dbClientPromise;

  const dbSession = dbClient.startSession();

  try {
    dbSession.startTransaction();

    const newBoard: NewBoard = req.body;

    await newBoardSchema.validate(newBoard);

    const db = await getDb();

    const now = new Date();

    const session = await getServerSession(req, res, authOptions);

    console.log("this right here", session);

    if (!session?.user.id) {
      throw new Error();
    }

    const boardId = new ObjectId();

    await Promise.all([
      db.collection<BoardModel>("boards").insertOne(
        {
          _id: boardId,
          createdAt: now,
          updatedAt: now,
          ...newBoard,
        },
        { session: dbSession }
      ),

      db.collection<BoardUserConnectionModel>("boardsUsers").insertOne(
        {
          _id: new ObjectId(),
          boardId: boardId,
          userId: new ObjectId(session.user.id),
          role: "owner",
          createdAt: now,
          updatedAt: now,
        },
        { session: dbSession }
      ),
    ]);

    await dbSession.commitTransaction();

    res
      .status(200)
      .json(getSuccessResponse({ detail: "Board created successfully!" }));
  } catch (err) {
    await dbSession.abortTransaction();
    handleError(res, err);
  } finally {
    dbSession.endSession();
  }
}
