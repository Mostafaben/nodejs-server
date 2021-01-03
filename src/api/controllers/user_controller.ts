import { Request, Response, Router } from 'express';
import { handleHttpError } from '../../utils/HttpResponseHandler';
import isImage from 'is-image';
import { body, validationResult } from 'express-validator';
import UserModel from '../../models/user';
import path from 'path';
import fs from 'fs';
import { userImageRoute } from '../../config/enviroment';
const uploadPath = './../../uploads/users/';

const router = Router();

/**
 * update user image
 */
router.post('/profile-picture', async (req: Request | any, res: Response) => {
  try {
    const { image } = req.files;
    const { _id } = req.user;
    if (!isImage(image.path))
      return handleHttpError(new Error('must be an image'), res, 400);
    const user: any = await UserModel.findById(_id).exec();
    const imageName = `user-${_id}`;
    const imagePath = path.join(__dirname, uploadPath + imageName);
    fs.renameSync(image.path, imagePath);
    user.profileImage = {
      imageName,
      imagePath,
    };
    await user.save();
    res.status(200).send({
      data: {
        imageUrl: userImageRoute + imageName,
      },
    });
  } catch (error) {
    handleHttpError(error, res, 400);
  }
});

/**
 * update user informations
 */

const updateInformationsValidation = [body('fullName').notEmpty().isAlpha()];

router.patch(
  '/informations',
  updateInformationsValidation,
  async (req: any, res: Response) => {
    try {
      const errors = validationResult(req);
      if (errors)
        return res.status(400).send({
          data: {
            success: false,
            errors,
          },
        });

      const { _id } = req.user;
      const { fullName } = req.body;
      const user: any = await UserModel.findById(_id).exec();
      user.fullName = fullName;
      await user.save();

      res.status(200).send({
        data: {
          message: 'full name updated successfully',
        },
      });
    } catch (error) {
      handleHttpError(error, res, 400);
    }
  }
);

export default router;
