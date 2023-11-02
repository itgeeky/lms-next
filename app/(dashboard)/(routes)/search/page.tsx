import { redirect, useParams } from 'next/navigation';
import { Categories } from './_components/categories';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import SearchInput from '@/components/search-input';
import { getCourses } from '@/actions/get-courses';
import CoursesList from './_components/courses-list';

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

  const courses = await getCourses({
    userId,
    title: searchParams.title,
    categoryId: searchParams.categoryId,
  })
  console.log('COURSES', courses)

  return (
    <>
    <div className='px-6 pt-6 md:hidden md:mb-0 block'>
      <SearchInput />
    </div>
      <div className='p-6'>
        <Categories items={categories} />
        <CoursesList items= {courses}/>
      </div>
    </>
  );
};

export default SearchPage;
