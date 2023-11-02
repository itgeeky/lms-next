import { Category, Course } from '@prisma/client';
import CourseCard from './course-card';

type CourseWithProgress = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgress[];
}

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4'>
        {items.map((course) => {
          return (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              imageUrl={course.imageUrl!}
              chaptersLength={course.chapters.length}
              price={course.price!}
              progress={course.progress!}
              category={course.category?.name!}
            />
          );
        })}
      </div>
      {items.length === 0 && (
        <div className='text-center text-gray-500 mt-10'>
          No courses found. Try changing your search.
        </div>
      )}
    </div>
  );
};

export default CoursesList;
