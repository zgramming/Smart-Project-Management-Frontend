export interface MasterCategoryEntity {
  error: boolean;
  message: string;
  total: number;
  data: Daum[];
}

interface Daum {
  id: number;
  parentMasterCategoryId?: number;
  name: string;
  code: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  ParentMasterCategory?: ParentMasterCategory;
  _count: Count;
}

interface ParentMasterCategory {
  id: number;
  parentMasterCategoryId: any;
  name: string;
  code: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Count {
  MasterData: number;
}
