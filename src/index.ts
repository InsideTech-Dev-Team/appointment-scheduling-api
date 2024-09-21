import { Elysia } from "elysia";
import { appointment } from "./routes/appointment";
import { ValidationError } from "elysia";
import { HTTPException } from "./utils/errors";
import type { ErrorApiResponse } from "./utils/types";

const app = new Elysia()
  .onError(({ error, set }) => {
    switch (true) {
      case error instanceof HTTPException:
        set.status = error.status;
        return {
          message: "Error Occured",
          error: {
            name: error.name,
            message: error.message,
          },
        } satisfies ErrorApiResponse;
      case error instanceof ValidationError:
        set.status = "Bad Request";
        return {
          message: "Validation Error",
          error: {
            name: error.name,
            message: error.message,
          },
        } satisfies ErrorApiResponse;
      default:
        return {
          status: 500,
          message: "Internal Server Error",
        };
    }
  })
  .use(appointment);

export type AppointmentScheduleApiType = typeof app;
export default app;
