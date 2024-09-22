import { Elysia, t } from "elysia";
import { appointmentHandler } from "./routes/appointment";
import { ValidationError } from "elysia";
import { HTTPException } from "./utils/errors";
import type { ErrorApiResponse, SuccessApiResponse } from "./utils/types";
import { scheduleHandler } from "./routes/schedules";
import { bookingHandler } from "./routes/booking";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(swagger())
  .onError(({ error, set }) => {
    console.error(error);
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
            message: JSON.parse(error.message),
          },
        } satisfies ErrorApiResponse;
      default:
        set.status = "Internal Server Error";
        return {
          message: "Internal Server Error",
          error: {
            name: error.name,
            message: error.message,
          },
        } satisfies ErrorApiResponse;
    }
  })
  .get("/health-check", {
    message: "OK",
    data: {
      timestamp: new Date(),
      uptime: Bun.nanoseconds(),
    },
  } satisfies SuccessApiResponse)
  .use(appointmentHandler)
  .use(scheduleHandler)
  .use(bookingHandler);

export type AppointmentScheduleApiType = typeof app;
export default app;
