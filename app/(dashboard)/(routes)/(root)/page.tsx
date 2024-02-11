import { getDashboarCourses } from '@/actions/get-dashboard-courses';
import { Button } from '@/components/ui/button';
import { UserButton, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import CoursesList from '../search/_components/courses-list';
import { CheckCircle2, Clock } from 'lucide-react';
import InfoCard from './_components/info-card';

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
        <InfoCard
          icon={Clock}
          label='Ongoing Courses'
          count={ongoingCourses.length}
        />
        <InfoCard
          icon={CheckCircle2}
          label='Completed Courses'
          count={completedCourses.length}
          variant='success'
        />
      </div>
      <CoursesList items={[...ongoingCourses ,...completedCourses]}/>

    </div>
  );
}
