import { z } from "zod";

const validate = (schema) => async (req, res, next) => {
  try {
    // Validate the request body against the provided Zod schema
    const parseBody = await schema.parseAsync(req.body);

    // Replace req.body with the parsed (validated) data
    req.body = parseBody;

    // Continue to the next middleware
    next();
  } catch (err) {
    // Check if it's a Zod validation error
    if (err instanceof z.ZodError) {
      // Extract the first error for a more specific message
      const firstError = err.errors[0];

      const error = {
        status: 422, // Unprocessable Entity
        message: "Fill the input fields properly",
        extraDetails: firstError.message,
      };

      // Pass the error to the next error-handling middleware
      next(error);
    } else {
      // Handle any unexpected errors
      next(err);
    }
  }
};

export default validate;
