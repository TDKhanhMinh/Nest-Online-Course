"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import * as React from "react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onConfirm,
  onCancel,
  confirmVariant = "default",
  isLoading: externalIsLoading,
}: ConfirmDialogProps) {
  const [internalIsLoading, setInternalIsLoading] = React.useState(false)
  const isLoading = externalIsLoading ?? internalIsLoading

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      setInternalIsLoading(true)
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error("Confirmation action failed:", error)
    } finally {
      setInternalIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="default">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant={confirmVariant}
          >
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
