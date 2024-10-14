import { ObjectId } from "mongodb";
import * as Yup from "yup";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserModel extends Omit<User, "id"> {
  _id: ObjectId;
  password: string;
}

export const userSchema: Yup.ObjectSchema<User> = Yup.object()
  .required()
  .strict()
  .noUnknown()
  .shape({
    id: Yup.string().required(),
    name: Yup.string().required(),
    email: Yup.string().required(),
  });

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export const signUpRequestSchema: Yup.ObjectSchema<SignUpRequest> = Yup.object()
  .required()
  .strict()
  .noUnknown()
  .shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email address is required")
      .email("Please provide a valid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
  });

export interface LoginRequest {
  email: string;
  password: string;
}

export const logInRequestSchema: Yup.ObjectSchema<LoginRequest> = Yup.object()
  .required()
  .strict()
  .noUnknown()
  .shape({
    email: Yup.string().required("Email address is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
  });
