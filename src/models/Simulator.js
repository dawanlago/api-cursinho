import { Schema, model } from 'mongoose';

const SimulatorSchema = new Schema(
  {
    title: String,
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    questions: [{}],
    time: String,
    publish: Boolean,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    modality: String,
    startDate: String,
    endDate: String,
  },
  { timestamps: true }
);

export default model('Simulator', SimulatorSchema);
