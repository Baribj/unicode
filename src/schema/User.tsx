import { ObjectId } from "mongodb";
import * as Yup from "yup";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "blocked";
  lastLogin: string;
  address: {
    country: {
      name: string;
      code: string;
    };
    state: {
      name: string;
      code: string;
    };
  };
}

export interface UserModel
  extends Omit<User, "createdAt" | "updatedAt" | "lastLogin" | "address"> {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  siteId: ObjectId;
  password: string;
  address: {
    countryCode: string;
    stateCode: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const userSchema: Yup.ObjectSchema<
  User & { password?: string; otp?: string }
> = Yup.object()
  .required()
  .strict()
  .noUnknown()
  .shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    email: Yup.string()
      .required()
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email address"
      ),
    createdAt: Yup.string().required(),
    updatedAt: Yup.string().required(),
    status: Yup.string()
      .required()
      .oneOf(["active" as const]),
    lastLogin: Yup.string().required(),
    address: Yup.object()
      .required()
      .strict()
      .noUnknown()
      .shape({
        country: Yup.object().required().strict().noUnknown().shape({
          name: Yup.string().required(),
          code: Yup.string().required(),
        }),
        state: Yup.object().required().strict().noUnknown().shape({
          name: Yup.string().required(),
          code: Yup.string().required(),
        }),
      }),

    password: Yup.string()
      .min(12)
      .when([], (password, schema) => {
        if (password !== undefined) {
          return schema.min(12);
        }
        return schema;
      }),

    otp: Yup.string(),
  });
