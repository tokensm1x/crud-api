import { resolve } from "path";
import { cwd } from "process";

export const usersPath = resolve(cwd(), "src/in-memory-db/users-db.ts");
export const INVALID_ID_ERROR: string = "Invalid user id";
export const USER_NOT_FOUND_ERROR: string = "User not found";
export const INVALID_DATA_ERROR: string = "Invalid Data:";
export const UNSUPPORTED_METHOD_ERROR: string = "Method not allowed";
export const ROUTE_NOT_FOUND_ERROR: string = "Requested resource not found";
export const SOMETHING_WENT_WRONG: string = "Something went wrong, try again later";
export const validationErrors = {
    USERNAME_NOT_EXIST_ERROR: INVALID_DATA_ERROR + " (Field 'username' is required')",
    AGE_NOT_EXIST_ERROR: INVALID_DATA_ERROR + " (Field 'age' is required')",
    HOBBIES_NOT_EXIST_ERROR: INVALID_DATA_ERROR + " (Field 'hobbies' is required')",
    USERNAME_IS_INVALID_ERROR: INVALID_DATA_ERROR + " (Incorrect value of 'username' field)",
    AGE_IS_INVALID_ERROR: INVALID_DATA_ERROR + " (Incorrect value of 'age' field)",
    HOBBIES_IS_INVALID_ERROR: INVALID_DATA_ERROR + " (Incorrect value of 'hobbies' field)",
};
