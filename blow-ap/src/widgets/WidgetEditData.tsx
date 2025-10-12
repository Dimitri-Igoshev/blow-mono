import type { FC, ReactNode } from 'react';
import { Card, CardBody, cn } from '@heroui/react';

interface WidgetEditDataProps {
  children?: ReactNode;
  className?: string;
}

export const WidgetEditData: FC<WidgetEditDataProps> = ({ children, className }) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardBody className='p-6 flex flex-col gap-3 w-full'>{children}</CardBody>
    </Card>
  );
};
