import React, {useState, useEffect} from 'react';
import {Button} from './ui/button';
import {TriangleAlert} from 'lucide-react';
import {Input} from './ui/input';
import {useTranslation} from 'react-i18next';

interface ConfirmDeleteAccountModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  userEmail: string; 
}
const ConfirmDeleteAccountModal: React.FC<ConfirmDeleteAccountModal> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  userEmail,
}) => {
  const {t} = useTranslation();
  const [emailInput, setEmailInput] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Validate if the typed email matches the user's account email
  useEffect(() => {
    setIsValid(
      emailInput.trim().toLowerCase() === userEmail.trim().toLowerCase(),
    );
  }, [emailInput, userEmail]);

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) setEmailInput('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full z-50 overflow-y-auto flex justify-center items-start p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="w-full max-w-[448px] my-auto rounded-3xl border border-zinc-800 p-6 shadow-2xl transition-colors duration-200 dark:border-zinc-800 bg-[#EEF3F2] dark:bg-[#142624] max-sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md sm:rounded-xl bg-linear-to-b from-[#C7000033] to-[#C700004D]">
              <TriangleAlert className="text-[#CE0000] size-4 sm:size-6" />
            </div>
            <h2 className="text-xl font-bold dark:text-[#EAF6F3]">
              {t('settings.account.unsafeChanges.modal.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="dark:text-[#EAF6F3] transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Warning Block (Red Box) */}
        <div className="mb-6 rounded-2xl border border-[#CE0000] dark:bg-linear-to-b bg-linear-to-b from-[#C7000033] to-[#C700004D] p-4 text-sm leading-relaxed">
          <p className="font-semibold text-[#CE0000] mb-2 text-base">
            {t('settings.account.unsafeChanges.modal.subTitle')}
          </p>
          <p className="mb-3 text-[#3A4A48] dark:text-[#BFD9D2] text-[14px]">
            {t('settings.account.unsafeChanges.modal.subTitleTwo')}
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[#3A4A48] dark:text-[#BFD9D2] font-medium text-[14px] marker:text-[#CE0000]">
            <li>{t('settings.account.unsafeChanges.modal.subtextOne')} </li>
            <li>{t('settings.account.unsafeChanges.modal.subtextTwo')} </li>
            <li>{t('settings.account.unsafeChanges.modal.subtextThree')} </li>
          </ul>
        </div>

        {/* Action Prompt */}
        <p className="text-sm text-[#0B1514] dark:text-[#EAF6F3] mb-2">
          {t('settings.account.unsafeChanges.modal.inputLabelStart')}
          <span className="text-[#CE0000]">
            {t('settings.account.unsafeChanges.modal.inputLabelMiddle')}{' '}
          </span>
          {t('settings.account.unsafeChanges.modal.inputLabelEnd')}
        </p>

        {/* Input Field */}
        <Input
          type="email"
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          placeholder={t(
            'settings.account.unsafeChanges.modal.inputPlaceholder',
          )}
        />

        {/* Info Banner (Cyan Box) */}
        <div className="flex gap-2 mb-6 mt-3 rounded-xl bg-[#FAFAFA] dark:bg-[#193432] shadow-md border dark:border-cyan-900/30 p-3.5">
          <span className="text-[#0B1514] dark:text-[#EAF6F3] mr-1">
            {t('settings.account.unsafeChanges.modal.important')}
          </span>
          <p className="leading-normal text-[#6F7E7C] dark:text-[#7F9E97] text-sm">
            {t('settings.account.unsafeChanges.modal.inputHint')}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex mt-[90px] flex-col sm:flex-row items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-5 h-11 cursor-pointer text-sm font-semibold transition-colors text-[#0B1514] dark:text-[#EAF6F3] hover:text-[#0B1514] tracking-tight"
          >
            {t('settings.account.unsafeChanges.modal.cancel')}
          </Button>
          <Button
            variant="destructive"
            disabled={!isValid}
            onClick={onConfirmDelete}
            className={`px-5 h-11 cursor-pointer text-sm font-semibold tracking-tight rounded-xl text-white transition-all
              ${
                isValid
                  ? 'bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white shadow-lg shadow-red-950/20 light-theme:bg-red-600 light-theme:text-white light-theme:border-none light-theme:hover:bg-red-700'
                  : 'bg-zinc-800/50 border border-zinc-800 text-zinc-600 cursor-not-allowed light-theme:bg-zinc-100 light-theme:border-zinc-200 light-theme:text-zinc-400'
              }`}
          >
            {t('settings.account.unsafeChanges.modal.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteAccountModal;
