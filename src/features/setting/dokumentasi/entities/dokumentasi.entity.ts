export interface IDokumentasi {
  products: Data[];
  total: number;
  skip: number;
  limit: number;
}

interface Data {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}
