import { db } from '@/lib/db';

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
  try {

    const publishChapters  = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    })

    const publishChaptersIds = publishChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishChaptersIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage = validCompletedChapters / publishChaptersIds.length * 100;

    return progressPercentage;

  } catch (error) {
    console.log('[GET_PROGERSS]', error );
    return 0;
  }
};
