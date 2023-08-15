import mongoose from 'mongoose';

const operationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Operation must contain name'],
    unique: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Operation must contain image url'],
  },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Operation',
    },
  ],
  pizzas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
    },
  ],
});

const Operation =
  mongoose.models.Operation || mongoose.model('Operation', operationSchema);
export default Operation;
