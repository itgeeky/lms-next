import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!url) {
      return new NextResponse('Bad request', { status: 400 });
    }

    //check if the person uploading the files is the owner
    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: params.courseId,
      },
    });
    return NextResponse.json(attachment);
  } catch (error) {
    console.log('COURSE_ID_ATTACHMENTS_POST: ', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
