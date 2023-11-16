import { getDashboarCourses } from '@/actions/get-dashboard-courses';
import { Button } from '@/components/ui/button';
import { UserButton, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import CoursesList from '../search/_components/courses-list';

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return;
    redirect('/');
  }

  const { completedCourses, ongoingCourses } = await getDashboarCourses(userId);

  return(
    <div className='p-6 space-y-4 '>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          INFO CARD
        </div>
        <div>
          INFO CARD
        </div>
      </div>
      <CoursesList items={[...completedCourses, ...ongoingCourses]}/>

    </div>
  );
}
