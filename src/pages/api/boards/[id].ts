import { ApiFailResponse, ApiSuccessResponse } from "@/schema/ApiResponse";
import { getDb } from "@/server/db";
import handleError from "@/server/utils/errorHandler";
import getSuccessResponse from "@/server/utils/response/getSuccessResponse";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  AggregatedBoardModel,
  Board,
  BoardModel,
  BoardUser,
} from "@/schema/Board";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccessResponse | ApiFailResponse>
) {
  switch (req.method) {
    case "GET":
      return getBoard(req, res);
  }
}

async function getBoard(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDb();

    const aggregatedBoardDocuments = await db
      .collection<BoardModel>("boards")
      .aggregate<AggregatedBoardModel>([
        {
          $match: { _id: new ObjectId(req.query.id as string) },
        },
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

    // TODO: loop isn't needed as the query should never return more than one board
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

    res.status(200).json(getSuccessResponse({}, boards[0]));
  } catch (err) {
    handleError(res, err);
  }
}
