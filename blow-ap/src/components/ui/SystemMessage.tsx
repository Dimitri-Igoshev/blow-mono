import { cn } from '@heroui/react';
import { FunctionComponent, ReactNode } from 'react';

interface SystemMessageProps {
  children: ReactNode;
  className?: string;
  type?: 'default' | 'success' | 'error';
}

const SystemMessage: FunctionComponent<SystemMessageProps> = ({
  children,
  type = 'default',
  className = '',
  ...props
}) => {
  return (
    <div
      className={cn(
        'py-3 px-4  rounded-xl  text-white',
        {
          ['bg-primary']: type === 'default',
          ['bg-success']: type === 'success',
          ['bg-error']: type === 'error',
        },
        className
      )}
      {...props}
    >
      <div className="">{children}</div>
    </div>
  );
};

export default SystemMessage;
