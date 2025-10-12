import { FC } from 'react';

interface LayoutAdminProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export const LayoutAdmin: FC<LayoutAdminProps> = ({ header, children }) => {
  return (
    <div className="w-screen min-h-screen flex flex-col gap-3">
      {header}
      {children}
    </div>
  );
};
