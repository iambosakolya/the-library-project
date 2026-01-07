import Image from 'next/image';
import { bannerStyles } from './banner.styles';

const BannerMain = () => {
  return (
    <div className={bannerStyles.root}>
      <div className={bannerStyles.content}>
        <Image
          src='/images/man-banner.png'
          alt='main banner'
          width={600}
          height={300}
          priority={true}
          className={bannerStyles.mainImage}
        />
        <div className={bannerStyles.textWrapper}>
          <h2 className={bannerStyles.title}>Welcome to the Library project</h2>
          <p className={bannerStyles.subtitle}>Dive into reading with us</p>
        </div>
      </div>
      <Image
        src='/images/banner.png'
        alt='banner'
        width={3000}
        height={300}
        priority={true}
        className={bannerStyles.bottomBanner}
      />
    </div>
  );
};

export default BannerMain;
