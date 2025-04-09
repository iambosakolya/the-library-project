import Image from 'next/image';

const BannerMain = () => {
  return (
    <div>
      <div className='flex items-center gap-6 p-4'>
        <Image
          src='/images/man-banner.png'
          alt='main banner'
          width={600}
          height={300}
          priority={true}
        />
        <div className=''>
          <h2 className='text-3xl font-bold'>Welcome to the Library project</h2>
          <p className='text-xl text-gray-600'>Dive into reading with us</p>
        </div>
      </div>
      <Image
        src='/images/banner.png'
        alt='banner'
        width={3000}
        height={300}
        priority={true}
      />
    </div>
  );
};

export default BannerMain;
