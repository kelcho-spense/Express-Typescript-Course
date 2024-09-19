import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

const validate = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error: any) {
        res.status(400).json({
            error: error.errors,
        });
    }
};

export default validate;

/**This is a middleware function named validate that takes a Zod schema as an argument.
 * It validates incoming HTTP requests against the provided schema. If the request is valid,
 * it calls the next middleware function (next()).
 * If the request is invalid, it returns a 400 error response with the validation errors. 
 *  */


