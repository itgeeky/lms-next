import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request,{ params }: { params: { courseId: string } }) {
  try {
    const {userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;
    const values = await req.json();
    const course = await db.course.update({
      where: { id: courseId, userId: userId },
      data: {
        ...values,
      },
    });

    return new NextResponse(JSON.stringify(course), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  

  } catch (error) {
    console.log("COURSEID", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
  
}