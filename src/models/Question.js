import { Schema, model } from 'mongoose';

const QuestionSchema = new Schema(
  {
    title: String,
    description: String,
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
    jury: {
      type: Schema.Types.ObjectId,
      ref: 'Jury',
      required: false,
      set: (v) => (v === '' ? null : v),
    },
    year: String,
    level: String,
    difficulty: String,
    modality: String,
    answers: [{}],
    feedback: String,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Question', QuestionSchema);
