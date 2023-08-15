import { ObjectId } from 'mongoose';

export interface PizzaCreate {
  name: string;
  imageUrl: string;
  ingredients: ObjectId[];
}
