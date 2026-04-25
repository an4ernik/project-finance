import ChartWrapper from './ChartWrapper'; 
import ChartsTitle from './ChartsTitle';

export function FinanceOverview({children}: {children: React.ReactNode}) {
  return (
 
    <ChartWrapper>
      <ChartsTitle type="overview" wrapperClasses="mb-6"/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-4 pb-4">
        {children}
      </div>
    </ChartWrapper>
  );
}
