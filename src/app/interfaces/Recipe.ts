export interface Recipe {
  id?: string;
  name: string;
  ingredients: [string];
  kcalTot: number;
  preparation: [string];
  filePath: string;
  fileId: string;
}
