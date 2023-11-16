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
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });
      if (existingMuxData) {
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
      try {
        if (existingMuxData) {
          await Video.Assets.del(existingMuxData.assetId);
        }
      } catch (error) {
        console.log('[MUX_DELETE]', error);
      }

      const asset = await Video.Assets.create({
        input: values.videoUrl,
        playback_policy: 'public',
        test: false,
      });

      await db.muxData.create({
        data: {
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
          chapterId: chapterId,
        },
      });
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
    console.log('CHAPTER_ID', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
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

    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    9;

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId: courseId },
    });

    if (!chapter) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });
      if (existingMuxData) {
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
      try {
        if (existingMuxData) {
          await Video.Assets.del(existingMuxData.assetId);
        }
      } catch (error) {
        console.log('[MUX_DELETE]', error);
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: { id: chapterId, courseId: courseId },
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
    return NextResponse.json(deletedChapter, {
      status: 200,
    });
  } catch (error) {
    console.log('CHAPTER_ID_DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
