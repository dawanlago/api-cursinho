import { Schema, model } from 'mongoose';

const MaterialSchema = new Schema(
  {
    title: String,
    type: String,
    content: String,
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    week: Number,
    day: Number,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Material', MaterialSchema);
