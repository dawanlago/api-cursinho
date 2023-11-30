import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: String,
    password: String,
    name: String,
    phone: String,
    cpf: String,
    admin: Boolean,
    verificationToken: String,
    active: Boolean,
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('User', UserSchema);
