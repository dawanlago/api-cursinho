import { Schema, model } from 'mongoose';

const SimulatorFileSchema = new Schema(
  {
    title: String,
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
    },
    content: String,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('SimulatorFile', SimulatorFileSchema);
