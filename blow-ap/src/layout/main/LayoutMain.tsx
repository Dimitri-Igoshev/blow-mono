import React from 'react';

import { LayoutMainNavbar } from './LayoutMainNavbar';

interface LayoutMainProps {
  children: React.ReactNode;
}

export const LayoutMain: React.FC<LayoutMainProps> = ({ children }) => {
  return (
    <div>
      <LayoutMainNavbar />
      <div className="p-3 sm:p-6 flex flex-col gap-3 sm:gap-6 mh">
        <div>{children}</div>
      </div>
    </div>
  );
};
