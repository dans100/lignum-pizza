export interface PizzaResponse {
  _id?: string;
  name: string;
  imageUrl: string;
  ingredients?: string[];
  operations?: string[];
}

export type AllPizzaResponse = PizzaResponse[];
