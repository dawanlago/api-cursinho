import { Schema, model } from 'mongoose';

const SubjectSchema = new Schema(
  {
    description: String,
    disciplines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Discipline',
      },
    ],
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Subject', SubjectSchema);
