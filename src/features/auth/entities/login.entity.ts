export interface LoginEntity {
  error: boolean;
  message: string;
  data: Data;
}

interface Data {
  token: string;
}
