'use client'

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import useConfirmationStore from '@/components/confirmation-dialog/confirmationStore'
import { Button } from '@/components/ui/button'

const ConfirmationDialog = () => {
  const {
    open,
    title,
    description,
    cancelLabel,
    actionLabel,
    onAction,
    closeConfirmation,
    confirmationButtonVariant,
  } = useConfirmationStore()

  return (
    <AlertDialog open={open} onOpenChange={closeConfirmation}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction asChild={true}>
            <Button
              variant={confirmationButtonVariant}
              onClick={onAction}
              type="button"
            >
              {actionLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmationDialog
