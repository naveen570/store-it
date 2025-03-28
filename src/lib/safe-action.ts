import { DEFAULT_SERVER_ERROR_MESSAGE } from "@/constants";
import { createSafeActionClient } from "next-safe-action";
import { UserError } from "./errors";
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    if (e instanceof UserError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
