'use client'

/**
 * useConfirmDialog Hook
 *
 * Manages confirmation dialog state for destructive or important actions.
 * Reduces boilerplate for the common pattern of:
 * - Open dialog → Show confirmation → Execute action → Close dialog
 *
 * @example
 * const dialog = useConfirmDialog<'delete' | 'archive'>()
 *
 * // In JSX:
 * <Button onClick={() => dialog.open('delete')}>Delete</Button>
 * <Button onClick={() => dialog.open('archive')}>Archive</Button>
 *
 * <Dialog open={dialog.isOpen} onClose={dialog.close}>
 *   {dialog.action === 'delete' && <DeleteConfirmation />}
 *   {dialog.action === 'archive' && <ArchiveConfirmation />}
 * </Dialog>
 */
import { useState, useCallback } from 'react'

export type ConfirmDialogState<TAction extends string = string> = {
  /** Whether the dialog is currently open */
  isOpen: boolean
  /** The action type that triggered the dialog */
  action: TAction | null
  /** Open the dialog with a specific action */
  open: (action: TAction) => void
  /** Close the dialog (resets action to null) */
  close: () => void
  /** Check if dialog is open with a specific action */
  isAction: (action: TAction) => boolean
}

/**
 * Hook for managing confirmation dialog state
 *
 * @param onClose - Optional callback when dialog closes
 */
export function useConfirmDialog<TAction extends string = string>(
  onClose?: () => void
): ConfirmDialogState<TAction> {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAction | null>(null)

  const open = useCallback((newAction: TAction) => {
    setAction(newAction)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setAction(null)
    onClose?.()
  }, [onClose])

  const isAction = useCallback(
    (checkAction: TAction) => isOpen && action === checkAction,
    [isOpen, action]
  )

  return {
    isOpen,
    action,
    open,
    close,
    isAction,
  }
}

export default useConfirmDialog
