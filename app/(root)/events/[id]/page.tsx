import { getEventById } from '@/lib/actions/club-request.actions';
import { checkUserRegistration } from '@/lib/actions/registration.actions';
import { notFound } from 'next/navigation';
import ClubEventDetails from '@/components/shared/club-event-details';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';

type EventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EventDetailPage = async ({ params }: EventDetailPageProps) => {
  const { id } = await params;
  const session = await auth();

  const result = await getEventById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const event = result.data;

  // Check if user is registered
  const registrationResult = await checkUserRegistration(undefined, id);
  const isRegistered = registrationResult.isRegistered || false;
  const registrationId = registrationResult.registrationId;

  // Fetch books if there are any
  const books =
    event.bookIds.length > 0
      ? await prisma.product.findMany({
          where: {
            id: {
              in: event.bookIds,
            },
          },
          select: {
            id: true,
            name: true,
            images: true,
            author: true,
          },
        })
      : [];

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <ClubEventDetails
        data={event}
        type='event'
        isRegistered={isRegistered}
        registrationId={registrationId}
        isAuthenticated={!!session}
        books={books}
      />
    </div>
  );
};

export default EventDetailPage;
