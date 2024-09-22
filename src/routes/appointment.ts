import { Elysia, t } from "elysia";
import { db } from "../utils/db";
import type { SuccessApiResponse, BaseApiResponse } from "../utils/types";

export const appointmentHandler = new Elysia({ prefix: "appointment" })
  .get("/", async () => {
    const appointments = await db.appointments.findMany();

    return {
      message: "Successfully retrieved appointments",
      data: appointments,
    } satisfies SuccessApiResponse;
  })
  .get(
    "/:id",
    async ({ params }) => {
      const appointment = await db.appointments.findUnique({
        where: { id: params.id },
      });

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      return {
        message: "Successfully retrieved appointment",
        data: appointment,
      } satisfies SuccessApiResponse;
    },
    {}
  )
  .post(
    "/",
    async ({ body }) => {
      const appointment = await db.appointments.create({
        data: {
          name: body.name,
          description: body.description,
        },
      });

      return {
        message: "Successfully created appointment",
        data: appointment,
      } satisfies SuccessApiResponse;
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const appointment = await db.appointments.update({
        where: { id: params.id },
        data: {
          name: body.name,
          description: body.description,
        },
      });

      return {
        message: "Successfully updated appointment",
        data: appointment,
      } satisfies SuccessApiResponse;
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
        startTime: t.String(),
      }),
    }
  )
  .delete("/:id", async ({ params }) => {
    await db.appointments.delete({
      where: {
        id: params.id,
      },
    });

    return {
      message: "Successfully Deleted",
    } satisfies BaseApiResponse;
  });
