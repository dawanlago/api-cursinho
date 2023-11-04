import { Schema, model } from 'mongoose';

const SimulatorAnseredSchema = new Schema(
  {
    questions: [{}],
    time: String,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('SimulatorAnswered', SimulatorAnseredSchema);
