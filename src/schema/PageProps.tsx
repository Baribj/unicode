import { User } from "./User";

export type PageProps<T = {}> = { user: User } & T;
