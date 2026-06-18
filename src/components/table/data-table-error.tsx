"use client"

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface DataTableErrorProps {
  error: Error | null
  onRetry?: () => void
}

export function DataTableError({ error, onRetry }: DataTableErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || 'An unexpected error occurred'}
        </AlertDescription>
      </Alert>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}