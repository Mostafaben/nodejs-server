import { Response } from 'express';

function handleHttpError(error: Error, res: Response, code: number) {
  return res.status(code).send({
    success: false,
    message: error.message,
  });
}

function handleValidationErrors(errors: any[], res: Response) {
  return res.status(400).send({
    success: false,
    errors,
  });
}

function handleHttpSuccessResponse(data: any, res: Response, code: number) {
  return res.status(code).send({
    data,
  });
}

export { handleHttpError, handleValidationErrors, handleHttpSuccessResponse };
