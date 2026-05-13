import {Suspense} from 'react';
import {Outlet} from 'react-router-dom';
import {PageSkeleton} from './PageSkeleton';

const PageWrapper = () => {
  return (
    <div className="flex-1 min-h-0 flex flex-col px-[25px] md:pr-[50px] pb-[33.5px]">
      <Suspense fallback={<PageSkeleton />}>
        {/* All your dashboard pages will render here */}
        <Outlet />
      </Suspense>
    </div>
  );
};

export default PageWrapper;
