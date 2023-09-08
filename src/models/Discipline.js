import { Schema, model } from 'mongoose';

const DisciplineSchema = new Schema(
  {
    description: String,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Discipline', DisciplineSchema);
