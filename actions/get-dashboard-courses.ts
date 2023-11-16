import { db } from '@/lib/db';
import { Category, Chapter, Course } from '@prisma/client';
import { getProgress } from './get-progress';


type CouseWithProgressWithCategory = Course & {
  category:  Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CouseWithProgressWithCategory[];
  ongoingCourses: CouseWithProgressWithCategory[];
};

export const getDashboarCourses = async (
  userId: string
): Promise<DashboardCourses> => {

  try {

    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
        },
        select: {
          course: {
            include: {
              category: true,
              chapters: {
                where:{
                  isPublished: true,
                },
                }
              }
            },
          }
    });

    const courses = purchasedCourses.map((purchase) => purchase.course) as CouseWithProgressWithCategory[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course['progress'] = progress;
    }

    return {
      completedCourses: courses.filter((course) => course.progress === 100),
      ongoingCourses: courses.filter((course) => (course.progress ?? 0 ) < 100),
    };
    
  } catch (error) {
    console.log('get dash courses error: ', error);
    return {
      completedCourses: [],
      ongoingCourses: [],
    }
  }

};
