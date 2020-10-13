export interface Recipe {
  id?: string;
  user: string;
  name: string;
  ingredients: [string];
  kcalTot: number;
  servings: number;
  preparation: [string];
  filePath: string;
  fileId: string;
}
