import { Box, Divider, lighten, Skeleton, Typography } from '@mui/material'
import { StatusBox, SuccessContent, SuccessHeader, SuccessPaper } from './SuccessRequestContent'
import { successData } from '../../mocks/data'
import React from 'react'

export const RequestSkeleton = () => {
  return (
    <SuccessPaper>
      <Box
        display="flex"
        sx={{ py: 1.5, px: 2, borderRadius: '3px 3px 0 0' }}
        bgcolor={(theme) => lighten(theme.palette.action.disabledBackground, .8)}
        gap={.5}
        justifyContent="space-between"
      >
        <Box>
          <Box sx={{ px: 0, pt: .5 }}>
            <Typography variant="body1" fontWeight={800} textAlign="center">
              HTTP Response
            </Typography>
          </Box>
        </Box>
        <Box>
          <Skeleton variant="rounded" animation="wave" sx={{ opacity: .5 }}>
            <StatusBox code={200} />
          </Skeleton>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ m: 2 }}>
        <Skeleton variant="rounded" animation="wave" sx={{ opacity: .5 }}>
          <SuccessContent data={successData} />
        </Skeleton>
      </Box>
    </SuccessPaper>
  )
}
