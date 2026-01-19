import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { footerStyles as styles } from './footer.styles';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.infoSection}>
            <h3 className={styles.title}>{APP_NAME}</h3>
            <p className={styles.description}>
              Discover a world of stories at The Library Project. Your journey
              through literature starts here.
            </p>
          </div>
          <div>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href='/' className={styles.link}>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/books' className={styles.link}>
                  Books
                </Link>
              </li>
              <li>
                <Link href='/events' className={styles.link}>
                  Events
                </Link>
              </li>
              <li>
                <Link href='/about' className={styles.link}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={styles.sectionTitle}>Customer Service</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href='/contact' className={styles.link}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href='/faq' className={styles.link}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href='/shipping' className={styles.link}>
                  Shipping
                </Link>
              </li>
              <li>
                <Link href='/returns' className={styles.link}>
                  Returns
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={styles.sectionTitle}>Connect With Us</h4>
            <div className={styles.socialButtons}>
              <Button size='icon' variant='ghost'>
                <Facebook className={styles.socialIcon} />
                <span className={styles.srOnly}>Facebook</span>
              </Button>
              <Button size='icon' variant='ghost'>
                <Instagram className={styles.socialIcon} />
                <span className={styles.srOnly}>Instagram</span>
              </Button>
              <Button size='icon' variant='ghost'>
                <Twitter className={styles.socialIcon} />
                <span className={styles.srOnly}>Twitter</span>
              </Button>
            </div>
            <div className={styles.newsletterButton}>
              <Button
                variant='outline'
                className={styles.newsletterButtonInner}
              >
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          © {currentYear} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
