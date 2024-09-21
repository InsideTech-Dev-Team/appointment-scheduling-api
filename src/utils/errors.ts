import type { ErrorNameEnum } from "./types";

export class HTTPException extends Error {
  status: number;
  message: string;
  name: ErrorNameEnum;

  constructor(status: number, message: string, name: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.name = name;
  }
}
