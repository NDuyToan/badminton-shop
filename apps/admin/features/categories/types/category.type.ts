export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
