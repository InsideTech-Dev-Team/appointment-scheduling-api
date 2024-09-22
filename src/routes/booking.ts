import Elysia, { t } from "elysia";
import { dateFormatRegex } from "../utils/regex";
import { HTTPException } from "../utils/errors";
import { db } from "../utils/db";
import type { ErrorApiResponse, SuccessApiResponse } from "../utils/types";
import { connect } from "bun";

export const bookingHandler = new Elysia({ prefix: "bookings" })
  // Get all bookings for a specific appointment on a specific date
  .get(
    "/:appointmentId",
    async ({
      params,
      query,
    }): Promise<SuccessApiResponse | ErrorApiResponse> => {
      // Validate Date String
      const dateIsValid = dateFormatRegex.test(query.date);
      if (!dateIsValid)
        throw new HTTPException(400, "Invalid Date", "DateInvalidError");

      const bookings = await db.bookings.findMany({
        where: {
          date: query.date,
          appointment_id: params.appointmentId,
        },
      });

      return {
        message: "Successfully Fetched Pre Existing Bookings",
        data: {
          bookings,
          queries: query,
        },
      };
    },
    {
      query: t.Object({
        date: t.String(),
      }),
    }
  )
  // Create a new booking for a specific appointment and schedule
  .post(
    "/:appointmentId/:scheduleId",
    async ({
      params,
      body,
    }): Promise<SuccessApiResponse | ErrorApiResponse> => {
      // Validate Date String
      const dateIsValid = dateFormatRegex.test(body.date);
      if (!dateIsValid)
        throw new HTTPException(400, "Invalid Date", "DateInvalidError");

      // Check if the scheduleId exists
      const scheduleExists = await db.schedules.findUnique({
        where: {
          id: params.scheduleId,
        },
      });

      if (!scheduleExists) {
        throw new HTTPException(
          404,
          "Schedule not found",
          "ScheduleNotFoundError"
        );
      }

      const booking = await db.bookings.create({
        data: {
          date: body.date,
          schedule_id: params.scheduleId,
          appointment_id: params.appointmentId,
          name: body.name,
          email: body.email,
        },
      });

      return {
        message: "Successfully Created Booking",
        data: {
          booking,
        },
      };
    },
    {
      body: t.Object({
        date: t.String(),
        name: t.String(),
        email: t.String(),
      }),
    }
  )
  // Get a specific booking by ID
  .get(
    "/:appointmentId/:scheduleId/:bookingId",
    async ({ params }): Promise<SuccessApiResponse | ErrorApiResponse> => {
      const booking = await db.bookings.findUnique({
        where: {
          id: params.bookingId,
        },
      });

      if (!booking) {
        throw new HTTPException(
          404,
          "Booking not found",
          "BookingNotFoundError"
        );
      }

      return {
        message: "Successfully Fetched Booking",
        data: {
          booking,
        },
      };
    }
  )
  // Update a specific booking by ID
  .put(
    "/:appointmentId/:scheduleId/:bookingId",
    async ({
      params,
      body,
    }): Promise<SuccessApiResponse | ErrorApiResponse> => {
      // Validate Date String
      if (body.date) {
        const dateIsValid = dateFormatRegex.test(body.date);
        if (!dateIsValid)
          throw new HTTPException(400, "Invalid Date", "DateInvalidError");
      }

      const booking = await db.bookings.update({
        where: {
          id: params.bookingId,
        },
        data: {
          date: body.date,
          name: body.name,
          email: body.email,
        },
      });

      return {
        message: "Successfully Updated Booking",
        data: {
          booking,
        },
      };
    },
    {
      body: t.Object({
        date: t.Optional(t.String()),
        name: t.Optional(t.String()),
        email: t.Optional(t.String()),
      }),
    }
  )
  // Delete a specific booking by ID
  .delete(
    "/:appointmentId/:scheduleId/:bookingId",
    async ({ params }): Promise<SuccessApiResponse | ErrorApiResponse> => {
      const booking = await db.bookings.delete({
        where: {
          id: params.bookingId,
        },
      });

      return {
        message: "Successfully Deleted Booking",
        data: {
          booking,
        },
      };
    }
  );
