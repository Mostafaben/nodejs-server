import { Request, Response, Router } from 'express';
import { handleHttpError } from '../../utils/HttpResponseHandler';
import path from 'path';

const usersUploadPath = './../../uploads/users/';
const router = Router();

router.get('/user-image/:imageName', async (req: Request, res: Response) => {
  try {
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, usersUploadPath + imageName);
    res.sendFile(imagePath);
  } catch (error) {
    handleHttpError(error, res, 400);
  }
});

export default router;
