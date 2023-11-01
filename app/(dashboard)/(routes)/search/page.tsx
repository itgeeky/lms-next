import { redirect, useParams } from 'next/navigation';
import { Categories } from './_components/categories';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import SearchInput from '@/components/search-input';

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <>
    <div className='px-6 pt-6 md:hidden md:mb-0 block'>
      <SearchInput />
    </div>
      <div className='p-6'>
        <Categories items={categories} />
      </div>
    </>
  );
};

export default SearchPage;
