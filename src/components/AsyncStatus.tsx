import { Box, CircularProgress } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import { FadeLoader } from './FadeLoader'
import React from 'react'

type AsyncStatusProps = {
  loading: boolean
  error?: boolean
  size?: number
  /** fade duration in ms */
  timeout?: number | { enter?: number; exit?: number }
}

export function AsyncStatus({
                              loading,
                              error,
                              size = 24,
                              timeout = 300
                            }: AsyncStatusProps) {
  return (
    <FadeLoader
      timeout={timeout}
      loading={loading}
      loadComponent={(
        <Box aria-label="Loading">
          <CircularProgress size={size} />
        </Box>
      )}
      component={
        error ?
          (
            <Box aria-label="Error">
              <ErrorOutlineOutlinedIcon color="error" sx={{ fontSize: size }} />
            </Box>
          )
          : (
            <Box aria-label="Success">
              <CheckCircleIcon color="success" sx={{ fontSize: size }} />
            </Box>
          )
      }
    />
  )
}
