import { cn } from '@/lib/utils';

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split('.');

  return (
    <p className={cn('text-xl', className)}>
      ${intValue}
      <span className='text-sm'>.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;
