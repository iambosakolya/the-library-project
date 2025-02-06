import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className='flex-center min-h-screen w-full'>{children}</div>
      <Footer />
    </div>
  );
}
