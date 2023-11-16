import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { db } from '@/lib/db';
import CourseSidebarItem from './course-sidebar-item';
import CourseProgress from '@/components/course-progress';

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
      <div className='h-[80px] flex flex-col items-center justify-center border-b'>
        <h1 className='font-semibold'>{course.title}</h1>
        {purchase && (
          <div className='mt-2'>
            <CourseProgress 
              variant='success'
              value={progressCount}
            />
          </div>
        ) }
      </div>
      <div className='flex flex-col w-full'>
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            courseId={course.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            isLocked={!chapter.isFree && !purchase}
          />
        ))
        }
      </div>
    </div>
  );
};

export default CourseSidebar;
