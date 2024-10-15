import { ApiFailResponse, ApiSuccessResponse } from "@/schema/ApiResponse";
import { getDb } from "@/server/db";
import handleError from "@/server/utils/errorHandler";
import getSuccessResponse from "@/server/utils/response/getSuccessResponse";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { PatchTask, patchTaskStatus, TaskModel } from "@/schema/Task";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccessResponse | ApiFailResponse>
) {
  switch (req.method) {
    case "PATCH":
      return patchTask(req, res);
  }
}

async function patchTask(req: NextApiRequest, res: NextApiResponse) {
  try {
    // the PATCH method should be generic to update anything .. however, this will do for now
    const taskId = req.query.id as string;

    const body: PatchTask = req.body;

    await patchTaskStatus.validate(body);

    const db = await getDb();

    const now = new Date();

    const session = await getServerSession(req, res, authOptions);

    if (!session?.user.id) {
      throw new Error();
    }

    await db.collection<TaskModel>("tasks").updateOne(
      {
        _id: new ObjectId(taskId),
      },
      { $set: { status: body.status, updatedAt: now } }
    );

    const io = req.socket.server.io;

    // Should probably fetch the Task and Board and pass their names instead of IDs here
    io.emit("task", {
      taskId: taskId,
      newStatus: body.status,
      userId: session.user.id,
    });

    res
      .status(200)
      .json(getSuccessResponse({ detail: "Task updated successfully!" }));
  } catch (err) {
    handleError(res, err);
  }
}
