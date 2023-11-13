export interface AccessModulSelectedUnselectedAccessEntity {
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
  modulId: number;
  name: string;
  code: string;
}

interface Unselected {
  categoryModulId: number;
  modulId: number;
  name: string;
  code: string;
}
