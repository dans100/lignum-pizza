export interface OperationResponse {
  _id?: string;
  name: string;
  imageUrl: string;
  pizzas?: string[];
  ingredients?: string[];
}

export type AllOperationResponse = OperationResponse[];
