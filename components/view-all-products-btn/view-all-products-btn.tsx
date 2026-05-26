import { Button } from '../ui/button';
import Link from 'next/link';
import { viewAllProductsStyles } from './styles';

const ViewAllProductsButton = () => {
  return (
    <div className={viewAllProductsStyles.wrapper}>
      <Button asChild className={viewAllProductsStyles.button}>
        <Link href='/search'>View all products</Link>
      </Button>
    </div>
  );
};

export default ViewAllProductsButton;
