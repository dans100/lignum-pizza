import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient msut contain name'],
    unique: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Operation must contain image url'],
  },
  operation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Operation',
  },
  pizzas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
    },
  ],
});

const Ingredient =
  mongoose.models.Ingredient || mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
