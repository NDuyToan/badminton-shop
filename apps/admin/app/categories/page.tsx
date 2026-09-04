import { Metadata } from 'next';
import { CategoryList } from '@/features/categories/components/category-list';

export const metadata: Metadata = {
  title: 'Categories | Admin Dashboard',
  description: 'Manage product categories in Badminton Shop Admin',
};

export default function AdminCategoriesPage() {
  return (
    <div className="max-w-[1600px] mx-auto w-full">
      <CategoryList />
    </div>
  );
}
