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
        subjects: [],
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
