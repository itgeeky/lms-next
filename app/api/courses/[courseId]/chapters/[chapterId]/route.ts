import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  params: {
    params: { courseId: string; chapterId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId, chapterId } = params.params;

    const { isPublished, ...values } = await req.json();

    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId}
    });

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: { id: chapterId, courseId: courseId },
      data: {
        ...values,
      },
    });

    return NextResponse.json(chapter, {
      status: 200,
    });

  } catch (error) {
    console.log("CHAPTER_ID", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
