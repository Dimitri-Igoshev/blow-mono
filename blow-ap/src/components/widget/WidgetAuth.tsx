import type { RootState } from '@/redux/store';

import { FunctionComponent, ReactNode } from 'react';
import { cn } from '@heroui/theme';
import { Card, CardBody } from '@heroui/card';
import { useSelector } from 'react-redux';

interface WidgetAuthProps {
  title: string;
  children: ReactNode;
  className?: string;
  error?: boolean;
}

export const WidgetAuth: FunctionComponent<WidgetAuthProps> = ({
  title,
  children,
  className = '',
  error,
}) => {
  const { project } = useSelector((state: RootState) => state.project);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 relative animate__animated animate__backInDown',
        className
      )}
    >
      <div className={cn('animate__animated', { ['animate__shakeX']: error })}>
        {project ? (
          <div className="absolute -top-[80px] left-0 text-2xl flex justify-center items-center w-full text-white font-semibold gap-3">
            {project?.config?.logoBigUrl ? (
              <img alt="Logo" className="h-[50px]" src={project.config.logoBigUrl} />
            ) : (
              <h2 className="text-[50px] uppercase">{project?.name}</h2>
            )}
          </div>
        ) : (
          <div className="absolute -top-[70px] left-0 text-2xl flex justify-center items-center w-full text-white font-semibold gap-3">
            <img alt="Logo" className="h-[30px]" src="/img/logo.svg" />
            <h2 className="text-[30px]">ADMIN PRO</h2>
          </div>
        )}

        <Card className="w-[350px] p-1 pb-1 rounded-[32px]">
          <CardBody className="flex flex-col gap-4">
            <div className="flex justify-center items-center bg-secondary text-white text-lg z-10 w-full h-[50px] rounded-full font-semibold mb-3">
              <h2>{title}</h2>
            </div>
            {children}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
