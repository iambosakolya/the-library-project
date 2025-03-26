import Image from 'next/image';

const BannerMain = () => {
  return (
    <div>
      <Image
        src='/images/man-banner.png'
        alt='main banner'
        width={600}
        height={300}
        priority={true}
      />
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
