import Image from 'next/image';
import loading from '@/assets/loading1.gif';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Image src={loading} height={150} width={150} alt='Loading...' />
    </div>
  );
};

export default Loading;
