import { Elysia } from "elysia";
import { HTTPException } from "./utils/types";
import { appointment } from "./routes/appointment";

const app = new Elysia()
  .onError(({ error }) => {
    switch (true) {
      case error instanceof HTTPException:
        return {
          status: error.status,
          message: error.message,
        };
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
