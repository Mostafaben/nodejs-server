import { Response } from 'express';
import { handleValidationErrors } from './HttpResponseHandler';

export function validateRequest(errors: any, res: Response) {
  if (!errors.isEmpty()) return handleValidationErrors(errors.array(), res);
}
