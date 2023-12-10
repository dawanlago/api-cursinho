import { Schema, model } from 'mongoose';

const ClassSchema = new Schema(
  {
    title: String,
    endDate: String,
    text: String,
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: false,
      set: (v) => (v === '' ? null : v),
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Class', ClassSchema);
