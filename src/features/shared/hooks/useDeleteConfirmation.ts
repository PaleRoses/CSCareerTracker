"use client";

import { useState, useTransition, useCallback } from "react";

interface UseDeleteConfirmationReturn<T> {
  itemToDelete: T | null;
  isOpen: boolean;
  isPending: boolean;
  requestDelete: (item: T) => void;
  confirmDelete: () => void;
  cancelDelete: () => void;
}

export function useDeleteConfirmation<T>(
  onDelete: (item: T) => Promise<void>
): UseDeleteConfirmationReturn<T> {
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [isPending, startTransition] = useTransition();

  const requestDelete = useCallback((item: T) => {
    setItemToDelete(item);
  }, []);

  const cancelDelete = useCallback(() => {
    setItemToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!itemToDelete) return;
    startTransition(async () => {
      await onDelete(itemToDelete);
      setItemToDelete(null);
    });
  }, [itemToDelete, onDelete]);

  return {
    itemToDelete,
    isOpen: itemToDelete !== null,
    isPending,
    requestDelete,
    confirmDelete,
    cancelDelete,
  };
}
