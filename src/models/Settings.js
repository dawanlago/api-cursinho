import { Schema, model } from 'mongoose';

const SettingsSchema = new Schema(
  {
    finance: {
      paymentMethods: [],
    },
    geral: {
      fullname: String,
    },
  },
  { timestamps: true }
);

export default model('Settings', SettingsSchema);
