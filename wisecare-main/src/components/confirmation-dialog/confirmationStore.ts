import { create } from 'zustand'

interface ConfirmationState {
  open: boolean
  title: string | null
  description: string | null
  cancelLabel: string | null
  actionLabel: string | null
  isLoading: boolean
  confirmationButtonVariant:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  onAction: () => void
  onCancel: () => void
}

interface ConfirmationActions {
  openConfirmation: (data: {
    title: string
    description: string
    cancelLabel: string
    actionLabel: string
    isLoading?: boolean
    confirmationButtonVariant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
    onAction: () => void
    onCancel: () => void
  }) => void
  closeConfirmation: () => void
}

const useConfirmationStore = create<ConfirmationState & ConfirmationActions>(
  (set) => ({
    open: false,
    title: null,
    description: null,
    cancelLabel: null,
    actionLabel: null,
    isLoading: false,
    confirmationButtonVariant: 'default',
    onAction: () => {},
    onCancel: () => {},
    openConfirmation: (data) =>
      set((_state) => ({
        open: true,
        title: data.title,
        description: data.description,
        cancelLabel: data.cancelLabel,
        actionLabel: data.actionLabel,
        isLoading: data.isLoading,
        confirmationButtonVariant: data.confirmationButtonVariant,
        onAction: data.onAction,
        onCancel: data.onCancel,
      })),
    closeConfirmation: () =>
      set((_state) => ({
        open: false,
        title: null,
        description: null,
        cancelLabel: null,
        actionLabel: null,
        isLoading: false,
        confirmationButtonVariant: 'default',
        onAction: () => {},
        onCancel: () => {},
      })),
  }),
)

export default useConfirmationStore
