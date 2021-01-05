import { Request, Response, Router } from 'express';
import { handleHttpError } from '../../utils/HttpResponseHandler';
import isImage from 'is-image';
import { body, validationResult } from 'express-validator';
import UserModel from '../../models/user';
import path from 'path';
import fs from 'fs';
import { userImageRoute } from '../../config/enviroment';
import { validateRequest } from '../../utils/validations';
const uploadPath = './../../uploads/users/';

const router = Router();

/**
 * update user image
 */
router.post('/profile-picture', async (req: Request | any, res: Response) => {
  try {
    const { image } = req.files;
    const { _id } = req.user;

    // check if the file sent is an image
    if (!isImage(image.path))
      return handleHttpError(new Error('must be an image'), res, 400);

    const user: any = await UserModel.findById(_id).exec();
    const extName = path.extname(image.path);
    const imageName = `user-${_id}${extName}`;
    const imagePath = path.join(__dirname, uploadPath + imageName);

    /**
     * @note
     * no need to delete the old image if exist because the new one will
     * remplace it
     */

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
 * @todo
 * add your costum fields
 */

const updateInformationsValidation = [body('fullName').notEmpty().isAlpha()];

router.patch(
  '/informations',
  updateInformationsValidation,
  async (req: any, res: Response) => {
    try {
      validateRequest(validationResult(req), res);
      const { _id } = req.user;
      const { fullName } = req.body;
      await UserModel.findByIdAndUpdate(_id, {
        fullName,
      }).exec();

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
