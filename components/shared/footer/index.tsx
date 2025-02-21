import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-background'>
      <div className='container mx-auto px-4 py-8 md:py-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>{APP_NAME}</h3>
            <p className='text-sm text-muted-foreground'>
              Discover a world of stories at The Library Project. Your journey
              through literature starts here.
            </p>
          </div>
          <div>
            <h4 className='mb-3 text-sm font-semibold uppercase'>
              Quick Links
            </h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/' className='hover:underline'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/books' className='hover:underline'>
                  Books
                </Link>
              </li>
              <li>
                <Link href='/events' className='hover:underline'>
                  Events
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:underline'>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='mb-3 text-sm font-semibold uppercase'>
              Customer Service
            </h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/contact' className='hover:underline'>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href='/faq' className='hover:underline'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='/shipping' className='hover:underline'>
                  Shipping
                </Link>
              </li>
              <li>
                <Link href='/returns' className='hover:underline'>
                  Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='mb-3 text-sm font-semibold uppercase'>
              Connect With Us
            </h4>
            <div className='flex space-x-4'>
              <Button size='icon' variant='ghost'>
                <Facebook className='h-4 w-4' />
                <span className='sr-only'>Facebook</span>
              </Button>
              <Button size='icon' variant='ghost'>
                <Instagram className='h-4 w-4' />
                <span className='sr-only'>Instagram</span>
              </Button>
              <Button size='icon' variant='ghost'>
                <Twitter className='h-4 w-4' />
                <span className='sr-only'>Twitter</span>
              </Button>
            </div>
            <div className='mt-4'>
              <Button variant='outline' className='w-full'>
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
        <div className='mt-8 pt-8 text-center text-sm text-muted-foreground'>
          © {currentYear} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
