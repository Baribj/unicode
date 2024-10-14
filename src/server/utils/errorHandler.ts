import { NextApiResponse } from "next";
import * as Yup from "yup";
import getErrorResponse from "./response/getErrorResponse";
import { MongoServerError } from "mongodb";

export default function handleError(res: NextApiResponse, err: unknown) {
  console.log(err);

  if (err instanceof Yup.ValidationError) {
    res.status(400).json({
      success: false,
      errors: err.errors.map((err) => {
        return {
          title: "Validation error",
          detail: err,
        };
      }),
    });
  } else if (err instanceof MongoServerError) {
    // unique index error
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0];

      res.status(400).json({
        success: false,
        errors: [
          {
            title: "Error",
            detail: duplicateField + " must be unique",
          },
        ],
      });
    } else {
      res.status(400).json(getErrorResponse());
    }
  } else {
    res.status(400).json(getErrorResponse());
  }
}
