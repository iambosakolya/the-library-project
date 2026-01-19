import { Skeleton } from '@/components/ui/skeleton';

const ClubsLoading = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <Skeleton className='mb-2 h-10 w-64' />
      <Skeleton className='mb-8 h-6 w-96' />

      <div className='flex flex-col gap-6 lg:flex-row'>
        {/* Sidebar Skeleton */}
        <aside className='w-full lg:w-64'>
          <Skeleton className='h-[600px] w-full rounded-lg' />
        </aside>

        {/* Main Content Skeleton */}
        <div className='flex-1 space-y-6'>
          {/* Search Bar Skeleton */}
          <Skeleton className='h-10 w-full' />

          {/* Results Count Skeleton */}
          <Skeleton className='h-5 w-48' />

          {/* Grid Skeleton */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className='h-80 w-full rounded-lg' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubsLoading;
