// MongoDB IDs are 24 hex characters. Reject anything else early with a 400,
// instead of letting Mongoose throw a confusing CastError.
const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export function validateObjectId(req, res, next) {
  if (!OBJECT_ID_PATTERN.test(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
}