import { Types } from 'mongoose';

export interface IngredientCreate {
  name: string;
  imageUrl: string;
  operationId: Types.ObjectId;
}
