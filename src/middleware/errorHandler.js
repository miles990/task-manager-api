import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err.message && err.message.includes('not found')) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};