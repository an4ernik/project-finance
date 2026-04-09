import IncomeModal from '@/components/ui/IncomeModal';
import {VirtualList} from '@/components/VirtualList';
import AppLayout from '@/layouts/AppLayout';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

function Income() {
  const {t} = useTranslation();

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <AppLayout
      title={t('income.title')}
      subtitle={t('income.subtitle')}
      action={
        <div className="flex gap-[36px]">
          <button className="cursor-pointer">Manage categories</button>
          <button onClick={handleOpenModal} className="cursor-pointer">
            Add Income
          </button>
        </div>
      }
    >
      {showModal && (
        <IncomeModal
          title={t('incomeModal.titleCreate')}
          onClose={handleCloseModal}
        />
      )}
      <VirtualList />
    </AppLayout>
  );
}

export default Income;
