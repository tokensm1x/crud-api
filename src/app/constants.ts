import { resolve } from "path";
import { cwd } from "process";

export const usersCp = resolve(cwd(), "src/in-memory-db/users-db.ts");
export const INVALID_ID_ERROR: string = "Invalid user id";
export const USER_NOT_FOUND_ERROR: string = "User not found";
export const INVALID_DATA_ERROR: string = "Invalid Data. Please enter a valid Data.";
export const UNSUPPORTED_METHOD_ERROR: string = "Method not allowed";
export const ROUTE_NOT_FOUND_ERROR: string = "Requested resource not found";
export const SOMETHING_WENT_WRONG: string = "Something went wrong, try again later";