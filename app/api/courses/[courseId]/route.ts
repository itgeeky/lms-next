import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

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
    const values = await req.json();
    const course = await db.course.update({
      where: { id: courseId, userId: userId },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);

  } catch (error) {
    console.log('COURSEID', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if(!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { courseId } = params;

    const course = await db.course.findFirst({
      where: { id: courseId, userId: userId },
      include:{
        chapters: {
          include:{
            muxData: true
          }
        }
      }
    });

    if (!course) {
      return new NextResponse('Not Found', { status: 404 });
    }

    for (const chapter of course.chapters) {
      if(chapter.muxData?.assetId){
        await Video.Assets.del(chapter.muxData?.assetId!);
      }
    }

    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json(deletedCourse);


  } catch (error) {
    console.log('COURSEID_DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
