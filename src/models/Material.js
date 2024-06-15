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
    discipline: {
      type: Schema.Types.ObjectId,
      ref: 'Discipline',
      required: false,
      set: (v) => (v === '' ? null : v),
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: false,
      set: (v) => (v === '' ? null : v),
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
