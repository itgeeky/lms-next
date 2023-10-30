import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH (
  req: Request,
  params: {
    params: { courseId: string; chapterId: string };
  }
){
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId, chapterId } = params.params;
    
    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

   
    const unpublisedChapter = await db.chapter.update({
      where: { id: chapterId, courseId: courseId },
      data: {
        isPublished: false,
      },
    });

    const publisedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
    });

    if (!publisedChapters.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unpublisedChapter);    
  } catch (error) {
    console.log('CHAPTER_ID_PUBLISH', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}