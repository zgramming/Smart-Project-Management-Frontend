export interface ProjectManagerClientEntity {
  message: string;
  error: boolean;
  total: number;
  data: Datum[];
}

interface Datum {
  id: string;
  name: string;
  code: string;
  description: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  _count: Count;
}

interface Count {
  Project: number;
}
