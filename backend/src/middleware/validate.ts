import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Validate request body/params/query against a Zod schema
export function validate(schema: ZodSchema, source: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res.status(400).json({ error: 'Validation failed', code: 'VALIDATION_ERROR', details: errors });
      } else {
        next(err);
      }
    }
  };
}

// Global error handler
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  console.error('[Error]', err.message, err.stack);

  if (err.code === 'P2002') {
    res.status(409).json({ error: 'Resource already exists', code: 'DUPLICATE' });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({ error: 'Resource not found', code: 'NOT_FOUND' });
    return;
  }

  if (err.name === 'MulterError') {
    res.status(400).json({ error: 'File upload error', code: 'UPLOAD_ERROR', message: err.message });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  res.status(statusCode).json({ error: message, code: err.code || 'INTERNAL_ERROR' });
}
