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
    students: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: false,
          set: (v) => (v === '' ? null : v),
        },
        registered: { type: Boolean, default: false },
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
