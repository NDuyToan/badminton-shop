import { Metadata } from 'next';
import { CategoryList } from '@/features/categories/components/category-list';

export const metadata: Metadata = {
  title: 'Categories | Admin Dashboard',
  description: 'Manage product categories in Badminton Shop Admin',
};

export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <CategoryList />
      </div>
    </div>
  );
}
