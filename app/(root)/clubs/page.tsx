import { getReadingClubs } from '@/lib/actions/club-request.actions';
import ClubEventCard from '@/components/shared/club-event-card';
import FilterSidebar from '@/components/shared/filter-sidebar';
import SearchBar from '@/components/shared/search-bar';
import Pagination from '@/components/shared/pagination';
import { notFound } from 'next/navigation';
import { BookOpenIcon } from 'lucide-react';
import { ReadingClub } from '@/types';

type SearchParams = {
  page?: string;
  search?: string;
  format?: 'online' | 'offline';
  startDate?: string;
  endDate?: string;
  location?: string;
};

type ClubsPageProps = {
  searchParams: SearchParams;
};

const ClubsPage = async ({ searchParams }: ClubsPageProps) => {
  const page = Number(searchParams.page) || 1;
  const limit = 12;

  // Parse filters
  const format = searchParams.format;
  const search = searchParams.search;
  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : undefined;
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : undefined;

  const result = await getReadingClubs({
    page,
    limit,
    format,
    search,
    startDate,
    endDate,
  });

  if (!result.success) {
    throw new Error(result.message);
  }

  const { data: clubs, pagination } = result;

  // Show not found if no results and filters/search are active
  const hasFilters = format || search || startDate || endDate;
  if (clubs.length === 0 && hasFilters) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='mb-2 text-4xl font-bold'>Reading Clubs</h1>
        <p className='mb-8 text-muted-foreground'>
          Discover and join reading clubs that match your interests
        </p>

        <div className='flex flex-col gap-6 lg:flex-row'>
          <aside className='w-full lg:w-auto'>
            <FilterSidebar showLocationFilter={true} />
          </aside>

          <div className='flex-1 space-y-6'>
            <SearchBar placeholder='Search clubs by title or description...' />

            <div className='py-16 text-center'>
              <BookOpenIcon className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
              <h2 className='mb-2 text-2xl font-semibold'>No clubs found</h2>
              <p className='mb-4 text-muted-foreground'>
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show not found if trying to access invalid page
  if (clubs.length === 0 && page > 1) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-2 text-4xl font-bold'>Reading Clubs</h1>
      <p className='mb-8 text-muted-foreground'>
        Discover and join reading clubs that match your interests
      </p>

      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Sidebar Filters */}
        <aside className='w-full lg:w-auto'>
          <FilterSidebar showLocationFilter={true} />
        </aside>

        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          {/* Search Bar */}
          <SearchBar placeholder='Search clubs by title or description...' />

          {/* Results Count */}
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              Showing {clubs.length} of {pagination?.totalCount || 0} clubs
              {search && ` for "${search}"`}
            </p>
          </div>

          {/* Clubs Grid */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {clubs.map((club: ReadingClub) => (
              <ClubEventCard key={club.id} data={club} type='club' />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className='flex justify-center pt-8'>
              <Pagination page={page} totalPages={pagination.totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;
