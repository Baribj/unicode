import { ApiFailResponse, ApiSuccessResponse } from "@/schema/ApiResponse";
import { SignUpRequest, signUpRequestSchema, UserModel } from "@/schema/User";
import { getDb } from "@/server/db";
import handleError from "@/server/utils/errorHandler";
import getSuccessResponse from "@/server/utils/response/getSuccessResponse";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiSuccessResponse | ApiFailResponse>
) {
  try {
    const newUser: SignUpRequest = req.body;

    await signUpRequestSchema.validate(newUser);

    const db = await getDb();

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    await db.collection<UserModel>("users").insertOne({
      _id: new ObjectId(),
      name: newUser.name,
      email: newUser.email.toLowerCase(),
      password: hashedPassword,
    });

    res
      .status(200)
      .json(
        getSuccessResponse({ detail: "Congrats, your account is now active!" })
      );
  } catch (err) {
    handleError(res, err);
  }
}
