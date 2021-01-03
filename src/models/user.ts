import mongoose from 'mongoose';
const { Schema } = mongoose;
import { ROLE, STATUS } from '../enum/enum';
const email = require('mongoose-type-email');

const UserShema = new Schema(
  {
    fullName: { type: String, required: true, minlength: 5 },
    email: { type: email, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: ROLE.USER },
    /**
     *
     * @todo
     * if you want your user to connect from multiple devices you can change refresh token to an array so that
     * you can store multiple refresh tokens for each device
     *
     */
    refreshToken: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },

    /**
     * @note
     * we need to store the path for the image in case we want to delete it
     */

    profileImage: {
      type: {
        imageName: { type: String, required: true },
        imagePath: { type: String, required: true },
      },
    },
    status: {
      type: Number,
      default: STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', UserShema);

export default UserModel;
export { UserShema };
