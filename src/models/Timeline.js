import { Schema, model } from 'mongoose';

const TimelineSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    days: [
      {
        day: String,
        date: String,
        time: String,
        subjects: [
          {
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
            important: Number,
            time: String,
          },
        ],
      },
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Timeline', TimelineSchema);
