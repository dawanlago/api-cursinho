import { Schema, model } from 'mongoose';

const SimulatorAnseredSchema = new Schema(
  {
    questions: [{}],
    time: String,
    questionsQuantity: Number,
    answersCorrect: Number,
    answersIncorrect: Number,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      set: (v) => (v === '' ? null : v),
    },
  },
  { timestamps: true }
);

export default model('SimulatorAnswered', SimulatorAnseredSchema);
