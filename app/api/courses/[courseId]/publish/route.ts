import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId } = params;

    const course = await db.course.findUnique({
      where: { id: courseId, userId: userId },
      include: {
        chapters: {
          include: {
            muxData: true
          }
        }
      }
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const hasPublishedChapters = course.chapters.some(chapter => chapter.isPublished);

    if (!hasPublishedChapters || !course.chapters.length || !course.title || !course.description || !course.price || !course.imageUrl || !course.categoryId) {
      return new NextResponse('Missing required fields', { status: 401 });
    }

    const publishedCourse = await db.course.update({
      where: { id: courseId, userId: userId },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);

  } catch (error) {
    console.log('COURSEID_PUBLISH', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}