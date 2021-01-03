import { Schema, model } from 'mongoose';

const wilayaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  name_ar: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  communs: [
    {
      name: {
        type: String,
        required: true,
      },
      name_ar: {
        type: String,
        required: true,
      },
      code: {
        type: Number,
        required: true,
      },
    },
  ],
});

const wilayaModel = model('Wilaya', wilayaSchema);
export default wilayaModel;

export { wilayaSchema };
