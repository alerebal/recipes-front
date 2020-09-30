export interface Recipe {
  id?: string;
  name: string;
  ingredients: [string];
  kcalTot: number;
  servings: number;
  preparation: [string];
  filePath: string;
  fileId: string;
}
