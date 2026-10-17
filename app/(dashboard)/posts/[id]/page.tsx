'use client';
import { useParams } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { PageTitle } from '@/components/ui';

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  return (<><PageTitle>Edit story</PageTitle><PostForm id={id} /></>);
}
