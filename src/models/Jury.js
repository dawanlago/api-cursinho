import { Schema, model } from 'mongoose';

const JurySchema = new Schema(
  {
    description: String,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Jury', JurySchema);
