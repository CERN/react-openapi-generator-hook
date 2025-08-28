import * as React from 'react'
import { Box, Fade, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

type AsyncStatusProps = {
  loading: boolean
  error?: boolean
  size?: number
  /** fade duration in ms (or separate enter/exit) */
  timeout?: number | { enter?: number; exit?: number }
}

const overlaySx = {
  position: 'absolute' as const,
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

export function AsyncStatus({
                              loading,
                              error = false,
                              size = 24,
                              timeout = 300
                            }: AsyncStatusProps) {
  const showLoading = loading
  const showError = !loading && error
  const showSuccess = !loading && !error

  return (
    <Box
      sx={{ position: 'relative', width: size, height: size, display: 'inline-flex' }}
      aria-live="polite"
      aria-busy={showLoading || undefined}
    >
      <Fade in={showLoading} unmountOnExit timeout={timeout}>
        <Box sx={overlaySx} aria-label="Loading">
          <CircularProgress size={size} />
        </Box>
      </Fade>

      <Fade in={showError} unmountOnExit timeout={timeout}>
        <Box sx={overlaySx} aria-label="Error">
          <ErrorIcon color="error" sx={{ fontSize: size }} />
        </Box>
      </Fade>

      <Fade in={showSuccess} unmountOnExit timeout={timeout}>
        <Box sx={overlaySx} aria-label="Success">
          <CheckCircleIcon color="success" sx={{ fontSize: size }} />
        </Box>
      </Fade>
    </Box>
  )
}
