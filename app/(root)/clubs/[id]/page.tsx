import { getReadingClubById } from '@/lib/actions/club-request.actions';
import { checkUserRegistration } from '@/lib/actions/registration.actions';
import { notFound } from 'next/navigation';
import ClubEventDetails from '@/components/shared/club-event-details';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';

type ClubDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const ClubDetailPage = async ({ params }: ClubDetailPageProps) => {
  const { id } = await params;
  const session = await auth();

  const result = await getReadingClubById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const club = result.data;

  // Check if user is registered
  const registrationResult = await checkUserRegistration(id, undefined);
  const isRegistered = registrationResult.isRegistered || false;
  const registrationId = registrationResult.registrationId;

  // Fetch books if there are any
  const books =
    club.bookIds.length > 0
      ? await prisma.product.findMany({
          where: {
            id: {
              in: club.bookIds,
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
        data={club}
        type='club'
        isRegistered={isRegistered}
        registrationId={registrationId}
        isAuthenticated={!!session}
        books={books}
      />
    </div>
  );
};

export default ClubDetailPage;
