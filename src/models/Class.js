import { Schema, model } from 'mongoose';

const ClassSchema = new Schema(
  {
    description: String,
    active: Boolean,
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: false,
      set: (v) => (v === '' ? null : v),
    },
    preEnrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        set: (v) => (v === '' ? null : v),
      },
    ],
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        set: (v) => (v === '' ? null : v),
      },
    ],
    numberOfWeeks: Number,
    image: String,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Class', ClassSchema);
