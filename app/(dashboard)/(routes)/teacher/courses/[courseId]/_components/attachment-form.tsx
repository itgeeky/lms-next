'use client';

import * as z from 'zod';
import axios from 'axios';
import { ImageIcon, Loader, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Attachment, Course } from '@prisma/client';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success('Attachment deleted');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 ? (
            <p className='text-sm text-slate-700 mt-2 italic'>
              No attachments yet
            </p>
          ) : (
            initialData.attachments.map((attachment) => (
              <div
                key={attachment.url}
                className='flex items-center gap-x-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-md p-3 mt-2'
              >
                <ImageIcon className='h-4 w-4 mr-2 flex-shrink-0' />
                <a
                  href={attachment.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-slate-700'
                >
                  <p className='text-xs line-clamp-1'>{attachment.name}</p>
                </a>
                {deletingId === attachment.id && (
                  <div>
                    <Loader className='h-4 w-4 animate-spin' />
                  </div>
                )}
                {deletingId !== attachment.id && (
                  <button className='ml-auto hover:opacity-75 transition' onClick={() => onDelete(attachment.id)}>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            ))
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            <p>
              <span className='font-medium'>Note:</span> You can only upload one
              file at a time. If you need to upload multiple files, you can zip
              them into a single file and upload that.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
