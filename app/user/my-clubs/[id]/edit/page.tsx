import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getClubEventForEdit } from '@/lib/actions/organizer.actions';
import { getAllProducts } from '@/lib/actions/product.actions';
import EditClubEventForm from '@/components/shared/edit-club-event-form';

export const metadata: Metadata = {
  title: 'Edit Club or Event',
  description: 'Edit your reading club or event details',
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
};

export default async function EditClubEventPage({
  params,
  searchParams,
}: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/user/my-clubs');
  }

  const { id } = await params;
  const { type: rawType } = await searchParams;
  const type = (rawType === 'event' ? 'event' : 'club') as 'club' | 'event';

  const [entityResult, productsResult] = await Promise.all([
    getClubEventForEdit(id, type),
    getAllProducts({ query: 'all', page: 1, limit: 1000 }),
  ]);

  if (!entityResult.success || !entityResult.data) {
    redirect('/user/my-clubs');
  }

  const products = JSON.parse(JSON.stringify(productsResult.data));

  return (
    <div className='mx-auto max-w-6xl space-y-8 px-4 py-8'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Edit {type === 'club' ? 'Reading Club' : 'Event'}
        </h1>
        <p className='text-muted-foreground'>
          Update the details of your {type}. Participants will be notified of
          significant changes.
        </p>
      </div>

      <EditClubEventForm
        entity={entityResult.data}
        type={type}
        products={products}
      />
    </div>
  );
}
