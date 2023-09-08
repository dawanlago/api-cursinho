import { Schema, model } from 'mongoose';

const TopicSchema = new Schema(
  {
    description: String,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  { timestamps: true }
);

export default model('Topic', TopicSchema);
