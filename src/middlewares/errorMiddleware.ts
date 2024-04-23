import { AnyZodObject, ZodError, ZodObject } from 'zod';



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
    // console.log(this.schema);
    
  }

  validate(data:any) {
    try {
      const result = this.schema.parse(data)
      // console.log(result, typeof result)
      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(typeof error)
        this.message = error.issues.map((issue) => issue.message).join(', ');
        return new ErrorMiddleware(400, this.message).toJSON();

      } else {
        throw error;
        
      }
    }
  }
}



