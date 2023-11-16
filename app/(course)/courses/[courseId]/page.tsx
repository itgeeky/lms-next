import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect('/');
  }
  const courseId = params.courseId;
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });
  if (!course) {
    redirect('/');
  }
  return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
