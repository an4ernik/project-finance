import AppLayout from '@/layouts/AppLayout';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import CategoriesManager from './CategoriesManager';
import {Cog, Plus} from 'lucide-react';
import VirtualList from '@/components/VirtualList';
import IncomeModal from '@/pages/income/modal/IncomeModal';

function Income() {
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const {t} = useTranslation();

  return (
    <AppLayout
      title={t('income.title')}
      subtitle={t('income.subtitle')}
      action={
        <div className="flex gap-[36px]">
          <Button
            className="cursor-pointer flex flex-row w-[224px]"
            onClick={() => setIsManageOpen(true)}
          >
            {t('income.actions.manageCategories')}
            <Cog />
          </Button>
          <Button
            onClick={() => setIsAddOpen(true)}
            className="cursor-pointer  w-[224px]"
          >
            {t('income.actions.addIncome')}
            <Plus />
          </Button>
        </div>
      }
    >
      {isManageOpen && (
        <CategoriesManager onClose={() => setIsManageOpen(false)} />
      )}

      {isAddOpen && <IncomeModal mode="create" onClose={() => setIsAddOpen(false)} />}

      <VirtualList />
    </AppLayout>
  );
}

export default Income;
