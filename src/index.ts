import { Elysia } from "elysia";

const app = new Elysia();

export type AppointmentScheduleApiType = typeof app;
export default app;
