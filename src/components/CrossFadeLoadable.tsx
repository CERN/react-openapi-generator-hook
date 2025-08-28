import * as React from 'react'
import { Box, Button, Fade, Paper, Typography } from '@mui/material'
import { RequestSkeleton } from './RequestSkeleton'

type CrossFadeLoadableProps = {
  loading: boolean
  error?: unknown
  children: React.ReactNode
  timeout?: number | { enter?: number; exit?: number }
  /** Keep footprint stable while loading/error */
  minWidth?: number | string
  minHeight?: number | string
  /** Optional overrides */
  skeleton?: React.ReactNode
  errorView?: React.ReactNode | ((err: unknown) => React.ReactNode)
  onRetry?: () => void
  /** Center layers (helpful when used inside flex rows) */
  center?: boolean
}

const layerSx = { gridArea: '1 / 1 / -1 / -1' } as const

export function CrossFadeLoadable({
                                        loading,
                                        error,
                                        children,
                                        timeout = 300,
                                        minWidth,
                                        minHeight,
                                        skeleton = <RequestSkeleton />,
                                        errorView,
                                        onRetry,
                                        center = false,
                                      }: CrossFadeLoadableProps) {
  const showLoading = !!loading
  const showError = !loading && !!error
  const showContent = !loading && !error

  const resolvedErrorView =
    typeof errorView === 'function' ? (errorView as (e: unknown) => React.ReactNode)(error) : errorView

  return (
    <Box
      sx={{
        display: 'grid',            // single-cell grid
        minWidth: (showLoading || showError) ? minWidth : undefined,
        minHeight: (showLoading || showError) ? minHeight : undefined,
        ...(center && { placeItems: 'center' }), // keep layers centered in the cell
        my: 2,
      }}
      aria-live="polite"
      aria-busy={showLoading || undefined}
    >
      {/* Content (in flow, lowest layer) */}
      <Fade in={showContent} mountOnEnter unmountOnExit timeout={timeout}>
        <Box sx={layerSx}>{children}</Box>
      </Fade>

      {/* Error layer (above content, interactive) */}
      <Fade in={showError} mountOnEnter unmountOnExit timeout={timeout}>
        <Box sx={layerSx}>
          {resolvedErrorView ?? <DefaultErrorCard error={error} onRetry={onRetry} />}
        </Box>
      </Fade>

      {/* Loading layer (top, non-interactive) */}
      <Fade in={showLoading} mountOnEnter unmountOnExit timeout={timeout}>
        <Box sx={{ ...layerSx, pointerEvents: 'none' }}>
          {skeleton}
        </Box>
      </Fade>
    </Box>
  )
}

function DefaultErrorCard({
                            error,
                            onRetry,
                            title = 'Something went wrong',
                          }: {
  error?: unknown
  onRetry?: () => void
  title?: string
}) {
  const message = typeof error === 'string'
    ? error
    : (error as any)?.message ?? 'Please try again.'
  return (
    <Paper sx={{ p: 2, display: 'grid', gap: 1 }}>
      <Typography variant="subtitle1" color="error">{title}</Typography>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{message}</Typography>
      {onRetry && (
        <Box sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={onRetry}>Retry</Button>
        </Box>
      )}
    </Paper>
  )
}
