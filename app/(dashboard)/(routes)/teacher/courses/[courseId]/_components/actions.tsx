'use client';
import { useState } from 'react';
import axios from 'axios';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useConfettiStore } from '@/hooks/use-confetti-store';

interface ActionsProps {
  courseId: string;
  disabled: boolean;
  isPublished: boolean;
}

const Actions = ({
  courseId,
  disabled,
  isPublished,
}: ActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onClick = async () => {
    try {
      setIsLoading(true);
      if(isPublished){
        await axios.patch(`/api/courses/${courseId}/unpublish`)
        toast.success('Course unpublished.');
      }
      else{
        await axios.patch(`/api/courses/${courseId}/publish`)
        toast.success('Course published.');
        confetti.onOpen();
      }
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong.');
    }finally {
     setIsLoading(false); 
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/courses/${courseId}`);
        toast.success('Course deleted.');
        router.refresh();
        router.push(`/teacher/courses`);
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button disabled={disabled} variant='outline' size='sm' onClick={onClick}>
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button variant='outline' size='sm' disabled={isLoading}>
          <Trash className='w-4 h-4 mr-2' /> Delete
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Actions;
