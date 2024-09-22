import Elysia, { t } from "elysia";
import { db } from "../utils/db";
import type { SuccessApiResponse } from "../utils/types";
import { timeFormatRegex } from "../utils/regex";
import { HTTPException } from "../utils/errors";

export const scheduleHandler = new Elysia({ prefix: "schedule" })
  .get("/list/:appointmentId", async ({ params }) => {
    const schedules = await db.schedules.findMany({
      where: {
        appointment_id: params.appointmentId,
      },
    });

    return {
      message: "Successfully Fetched Schedules",
      data: {
        schedules,
      },
    } satisfies SuccessApiResponse;
  })
  .post(
    "/create/:appointmentId",
    async ({ body, params }) => {
      // Validate Time Via Regex
      const timeIsValid = timeFormatRegex.test(body.time);
      if (!timeIsValid)
        throw new HTTPException(
          400,
          "Invalid Time Format",
          "TimeFormatInvalid"
        );

      const schedule = await db.schedules.create({
        data: {
          time: body.time,
          utc: body.utc,
          appointment_id: params.appointmentId,
        },
      });

      return {
        message: "Successfully Created Schedule",
        data: {
          schedule,
        },
      } satisfies SuccessApiResponse;
    },
    {
      body: t.Object({
        time: t.String(),
        utc: t.Number(),
      }),
    }
  )
  .get("/:scheduleId", async ({ params }) => {
    const schedule = await db.schedules.findUnique({
      where: {
        id: params.scheduleId,
      },
    });

    return {
      message: "Successfully Fetched Schedule Details",
      data: {
        schedule,
      },
    } satisfies SuccessApiResponse;
  })
  .put(
    "/:scheduleId",
    async ({ params, body }) => {
      // Validate Time Via Regex
      const timeIsValid = timeFormatRegex.test(body.time);
      if (!timeIsValid)
        throw new HTTPException(
          400,
          "Invalid Time Format",
          "TimeFormatInvalid"
        );

      const schedule = await db.schedules.update({
        where: {
          id: params.scheduleId,
        },
        data: { time: body.time, utc: body.utc },
      });

      return {
        message: "Successfully Updated Schedule",
        data: {
          schedule,
        },
      } satisfies SuccessApiResponse;
    },
    {
      body: t.Object({
        time: t.String(),
        utc: t.Number(),
      }),
    }
  )
  .delete("/:scheduleId", async ({ params }) => {
    const schedule = await db.schedules.delete({
      where: {
        id: params.scheduleId,
      },
    });

    return {
      message: "Successfully Deleted Schedule",
      data: {
        schedule,
      },
    } satisfies SuccessApiResponse;
  });
