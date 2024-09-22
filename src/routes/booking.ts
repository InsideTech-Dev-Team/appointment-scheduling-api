import Elysia, { t } from "elysia";
import { dateFormatRegex } from "../utils/regex";
import { HTTPException } from "../utils/errors";
import { db } from "../utils/db";
import type { ErrorApiResponse, SuccessApiResponse } from "../utils/types";

export const bookingHandler = new Elysia({ prefix: "bookings" }).get(
  "/:appointmentId",
  async ({ params, query }): Promise<SuccessApiResponse | ErrorApiResponse> => {
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
);
