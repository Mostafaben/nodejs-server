import { Request, Response, Router } from 'express';
import UserModel from '../../models/user';
import { handleHttpError } from '../../utils/HttpResponseHandler';
const pageElements: number = 10;
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const count = await UserModel.find({}).countDocuments();
    const pages = Math.floor(count / pageElements);
    const users = await UserModel.find({})
      .select('-password')
      .limit(pageElements)
      .skip(pageElements * Number(page))
      .exec();

    res.status(200).send({
      data: {
        users,
        pages,
        pageElements,
      },
    });
  } catch (error) {
    handleHttpError(error, res, 500);
  }
});

/**
 *
 * update user status
 *
 */
router.patch('/:id/:status', async (req: Request, res: Response) => {
  try {
    const { id, status } = req.params;
    const user: any = await UserModel.findById(id).exec();
    if (!user)
      return handleHttpError(new Error('user was not found'), res, 404);
    user.status = status;
    await user.save();
    res.status(200).send({
      data: {
        message: 'user was updated successfully',
      },
    });
  } catch (error) {
    handleHttpError(error, res, 500);
  }
});

export default router;
