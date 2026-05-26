
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CurrencySign = '$' | '₴' | '€';
export type CurrencyCode = 'USD' | 'EUR' | 'UAH';

const currencyMap: Record<CurrencyCode, CurrencySign> = {
    USD: '$',
    EUR: '€',
    UAH: '₴',
};

type CurrencyStore = {
    currencyCode: CurrencyCode;
    CURRENCY_SIGN: CurrencySign;
    setCurrency: (code: CurrencyCode) => void;
};

const initialState: CurrencyStore = {
    currencyCode: 'UAH',
    CURRENCY_SIGN: '₴',
    setCurrency: () => { }, 
};

const useCurrencyStore = create<CurrencyStore>()(
    persist(
        (set) => ({
            ...initialState,
            setCurrency: (code) =>
                set({
                    currencyCode: code,
                    CURRENCY_SIGN: currencyMap[code],
                }),
        }),
        {
            name: 'currency-store', // localStorage key
        }
    )
);
export const useGetCurrencySign = () => useCurrencyStore((state) => state.CURRENCY_SIGN);
export const useSetCurrencySign = () => useCurrencyStore.getState().setCurrency;