// Handles requests to /api/... URLs that don't exist.
export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler. Express recognises it by its 4 parameters.
// Every error in the app ends up here and leaves as { message } JSON.
// Raw stack traces are logged on the server only, never sent to the browser.
export function errorHandler(err, req, res, next) {
  // Mongoose validation failed (required, maxlength, enum...)
  if (err.name === 'ValidationError') {
    const firstMessage = Object.values(err.errors)[0].message;
    return res.status(400).json({ message: firstMessage });
  }

  // Bad value type, e.g. an object where a string is expected
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for "${err.path}"` });
  }

  // Duplicate key: violates the unique index
  if (err.code === 11000) {
    return res.status(409).json({ message: 'That name already exists' });
  }

  // Database connection failure / timeout
  if (
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoTimeoutError'
  ) {
    return res.status(503).json({
      message: 'Database connection error. Please verify MongoDB is running.',
    });
  }

  // Request body is not valid JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON' });
  }

  console.error('Server Error:', err); // full details in terminal only
  res.status(500).json({ message: 'Something went wrong on the server' });
}
