import { AnyZodObject, ZodError } from 'zod';

export class ErrorMiddleware extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
   toJSON() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}


export class ZodMiddleware extends ErrorMiddleware {
  schema: AnyZodObject;

  constructor(schema: AnyZodObject) {
    super(400, 'Validation Error');
    this.schema = schema;
  }

  validate(data: any) {
    try {
      this.schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        this.message = error.issues.map((issue) => issue.message).join(', ');
        throw this;
      } else {
        throw error;
      }
    }
  }
}