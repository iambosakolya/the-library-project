import { getEvents } from '@/lib/actions/club-request.actions';
import ClubEventCard from '@/components/shared/club-event-card';
import FilterSidebar from '@/components/shared/filter-sidebar';
import SearchBar from '@/components/shared/search-bar';
import Pagination from '@/components/shared/pagination';
import { notFound } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { Event } from '@/types';

type SearchParams = {
  page?: string;
  search?: string;
  format?: 'online' | 'offline';
  startDate?: string;
  endDate?: string;
  location?: string;
};

type EventsPageProps = {
  searchParams: Promise<SearchParams>;
};

const EventsPage = async ({ searchParams }: EventsPageProps) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 12;

  // Parse filters
  const format = params.format;
  const search = params.search;
  const startDate = params.startDate ? new Date(params.startDate) : undefined;
  const endDate = params.endDate ? new Date(params.endDate) : undefined;

  const result = await getEvents({
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

  const { data: events, pagination } = result;

  // Show not found if no results and filters/search are active
  const hasFilters = format || search || startDate || endDate;
  if (events.length === 0 && hasFilters) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='mb-2 text-4xl font-bold'>Events</h1>
        <p className='mb-8 text-muted-foreground'>
          Find book-related events and literary gatherings
        </p>

        <div className='flex flex-col gap-6 lg:flex-row'>
          <aside className='w-full lg:w-auto'>
            <FilterSidebar showLocationFilter={true} />
          </aside>

          <div className='flex-1 space-y-6'>
            <SearchBar placeholder='Search events by title or description...' />

            <div className='py-16 text-center'>
              <CalendarIcon className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
              <h2 className='mb-2 text-2xl font-semibold'>No events found</h2>
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
  if (events.length === 0 && page > 1) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-2 text-4xl font-bold'>Events</h1>
      <p className='mb-8 text-muted-foreground'>
        Find book-related events and literary gatherings
      </p>

      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Sidebar Filters */}
        <aside className='w-full lg:w-auto'>
          <FilterSidebar showLocationFilter={true} />
        </aside>

        {/* Main Content */}
        <div className='flex-1 space-y-6'>
          {/* Search Bar */}
          <SearchBar placeholder='Search events by title or description...' />

          {/* Results Count */}
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              Showing {events.length} of {pagination?.totalCount || 0} events
              {search && ` for "${search}"`}
            </p>
          </div>

          {/* Events Grid */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {events.map((event: Event) => (
              <ClubEventCard key={event.id} data={event} type='event' />
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

export default EventsPage;
