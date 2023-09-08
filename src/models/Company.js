import { Schema, ObjectId, model } from 'mongoose';

const CompanySchema = new Schema({
    _id: ObjectId,
    name: String,
    active: Boolean,
}, { timestamps: true });

export default model('Company', CompanySchema);