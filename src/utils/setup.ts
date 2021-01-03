import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { ROLE } from '../enum/enum';
import wilayaModel from '../models/region';
import UserModel from '../models/user';
const adminStarterPassword = '12345678';
const rounds = 10;

export async function createAdmin() {
  const count: number = await UserModel.find({ role: ROLE.ADMIN })
    .countDocuments()
    .exec();
  if (count >= 1) return;
  const admin = new UserModel({
    fullName: 'admin',
    email: 'test@test.com',
    password: bcrypt.hashSync(adminStarterPassword, rounds),
    role: ROLE.ADMIN,
    isVerified: true,
    verifiedAt: new Date(),
    refreshToken: null,
  });
  await admin.save();
}

const relativePath = './../json/wilayas.json';
export async function setupRegions() {
  const count: number = await wilayaModel.find({}).countDocuments();
  if (count > 0) return;
  const absolutePath = path.join(__dirname, relativePath);
  fs.readFile(absolutePath, (err, data: any) => {
    const wilayas: Array<any> = JSON.parse(data).wilayas;
    wilayas.forEach((wilaya) => {
      const communs: Array<{ code: string; name: string; name_ar: string }> =
        wilaya.dairas;
      const { name_ar, name, code } = wilaya;
      new wilayaModel({
        name_ar,
        name,
        code,
        communs,
      }).save();
    });
  });
}

function setupServer() {
  createAdmin();
  setupRegions();
}

export default setupServer;
