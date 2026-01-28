import { Metadata } from 'next';
import BookSubmissionForm from '@/components/user/book-submission-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Submit a Book',
  description: 'Submit a new book to our catalog',
};

const SubmitBookPage = async () => {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/sign-in');
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold'>Submit a New Book</h1>
        <p className='text-muted-foreground'>
          Can not find a book in our catalog? Submit it here and we will review
          and add it to our collection.
        </p>
      </div>

      <BookSubmissionForm />
    </div>
  );
};

export default SubmitBookPage;
