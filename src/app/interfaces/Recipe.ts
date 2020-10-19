export interface Recipe {
  id?: string;
  userId: string;
  name: string;
  ingredients: [string];
  kcalTot: number;
  servings: number;
  preparation: [string];
  filePath: string;
  fileId: string;
}
