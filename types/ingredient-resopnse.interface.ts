export interface IngredientResponse {
  _id?: string;
  name: string;
  imageUrl: string;
  pizzas?: string[];
  operation?: string;
}

export type AllIngredientResponse = IngredientResponse[];
