import { Schema, model } from 'mongoose';

const FlashcardSchema = new Schema(
  {
    description: String,
    answer: String,
    adm: {
      type: Schema.Types.Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      set: (v) => (v === '' ? null : v),
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
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Flashcard', FlashcardSchema);
