import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza name is required'],
    unique: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Pizza image url is required'],
  },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
    },
  ],
  operations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Operation',
    },
  ],
});

const Pizza = mongoose.models.Pizza || mongoose.model('Pizza', pizzaSchema);
export default Pizza;
