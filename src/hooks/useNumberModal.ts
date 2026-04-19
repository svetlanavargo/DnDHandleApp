import { useCallback, useMemo, useState } from 'react';
type ConfirmCallback = (value: number) => void;

export const useNumberModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [name, setName] = useState<string | undefined>();
    const [defaultValue, setDefaultValue] = useState(0);
    const [min, setMin] = useState<number | undefined>();
    const [max, setMax] = useState<number | undefined>();
    const [onConfirm, setOnConfirm] = useState<ConfirmCallback | null>(null);

    const [modalKey, setModalKey] = useState(0);

    const openModal = useCallback(({
                           title,
                           name,
                           defaultValue = 0,
                           min,
                           max,
                           onConfirm,
                       }: {
        title: string;
        name?: string;
        defaultValue?: number;
        min?: number;
        max?: number;
        onConfirm: ConfirmCallback;
    }) => {
        setTitle(title);
        setName(name);
        setDefaultValue(defaultValue);
        setMin(min);
        setMax(max);
        setOnConfirm(() => onConfirm);
        setModalKey(prev => prev + 1);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => setIsOpen(false), []);

    return useMemo(() => ({
        isOpen,
        title,
        name,
        defaultValue,
        min,
        max,
        onConfirm,
        modalKey,
        openModal,
        closeModal,
    }), [isOpen, title, name, defaultValue, min, max, onConfirm, modalKey, openModal, closeModal]);
};
