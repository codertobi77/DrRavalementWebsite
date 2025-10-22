import { useState, useCallback } from 'react';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);

  const confirm = useCallback((opts: ConfirmationOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!options) return;

    try {
      setIsLoading(true);
      await options.onConfirm();
    } catch (error) {
      console.error('Error during confirmation:', error);
      options.onError?.(error);
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  }, [options]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  return {
    isOpen,
    isLoading,
    options,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
