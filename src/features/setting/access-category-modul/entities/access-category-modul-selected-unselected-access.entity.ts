export interface AccessCategoryModulSelectedUnselectedAccessEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  selected: Selected[];
  unselected: Unselected[];
}

interface Selected {
  categoryModulId: number;
  name: string;
}

interface Unselected {
  categoryModulId: number;
  name: string;
}
