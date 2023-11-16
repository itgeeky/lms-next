import { Chapter, Course, UserProgress } from '@prisma/client';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CourseSidebar from './course-sidebar';

interface CourseMobileSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseMobileSidebar = ({
  course,
  progressCount,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden  pr-4 hover:opacity-75 transition'>
        <Menu className='h-8 w-8 ml-4' />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white w-72'>
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
