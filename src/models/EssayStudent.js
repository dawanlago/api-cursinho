import { Schema, model } from 'mongoose';

const EssayStudentSchema = new Schema(
  {
    image: String,
    imageCorrected: String,
    grade: Number,
    commented: String,
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    essayAdm: {
      type: Schema.Types.ObjectId,
      ref: 'Essay',
    },
    corrected: Boolean,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('EssayStudent', EssayStudentSchema);
