import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import next from 'next';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request,{ params }: { params: { courseId: string, attachmentId: string } }) {
  try {
    const {userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, attachmentId } = params;

    if(!courseId || !attachmentId){
      return new NextResponse("Bad Request", { status: 400 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId: userId },
    });

    if(!courseOwner){
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const attachment = await db.attachment.delete({
      where: { id: attachmentId, courseId: courseId },
    });
   
    return NextResponse.json(attachment);
  
  } catch (error) {
    console.log("ATTACHMENT_ID_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
  
}