import {Outlet} from 'react-router-dom';

const PageWrapper = () => {
  return (
    <div className="flex-1 min-h-0 flex flex-col px-[25px] md:pr-[50px] pb-[33.5px]">
      <Outlet />
    </div>
  );
};

export default PageWrapper;
