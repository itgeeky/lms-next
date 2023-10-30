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

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });

    const muxData = await db.muxData.findUnique({
      where: { chapterId: chapterId },
    });

    if (!chapter || !muxData || !chapter.videoUrl || !chapter.description || !chapter.title) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const publisedChapter = await db.chapter.update({
      where: { id: chapterId, courseId: courseId },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publisedChapter);    
  } catch (error) {
    console.log('CHAPTER_ID_PUBLISH', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}