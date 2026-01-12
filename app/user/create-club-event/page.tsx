import { Metadata } from 'next';
import ClubEventForm from '@/components/shared/club-event-form';
import { getAllProducts } from '@/lib/actions/product.actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Reading Club or Event',
  description:
    'Create a new reading club or event to connect with other readers',
};

export default async function CreateClubEventPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/sign-in?callbackUrl=/user/create-club-event');
  }

  // Get all products for book selection
  const productsResult = await getAllProducts({
    query: 'all',
    page: 1,
    limit: 1000, // Get all books for selection
  });

  // Serialize products to plain objects for client component
  const products = JSON.parse(JSON.stringify(productsResult.data));

  return (
    <div className='mx-auto max-w-6xl space-y-8 px-4 py-8'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Create a Reading Club or Event
        </h1>
        <p className='text-muted-foreground'>
          Start a reading club for ongoing book discussions or create a one-time
          event. Your request will be reviewed by our team before it goes live.
        </p>
      </div>

      <ClubEventForm products={products} />
    </div>
  );
}
