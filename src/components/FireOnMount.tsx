import React from 'react'

import '../stories/style.css'
import { useApi } from '../hook/useApi'
import { Box, Chip, lighten, Typography, useTheme } from '@mui/material'
import { DefaultApiFactory } from '../../open-api-configuration/api'
import { AsyncStatus } from './AsyncStatus'
import { CrossFadeLoadable } from './CrossFadeLoadable'
import { SuccessRequestContent } from './SuccessRequestContent'

export const FireOnMount = () => {
  const theme = useTheme()
  const [{ data, error, loading }] = useApi({
    apiFactory: DefaultApiFactory,
    methodName: 'fetchData'
  })
  return (
    <Box justifyContent="center" alignItems="center" display="flex" flexDirection="column">
      <Box display="flex" gap={2} alignItems="center" justifyContent="space-between">
        <Chip label="GET" sx={{ backgroundColor: lighten(theme.palette.success.light, .8) }} />
        <Typography variant="h4" fontWeight={300}>/mocks/data</Typography>
        <AsyncStatus loading={loading} error={!!error} />
      </Box>
      <Box>
        <CrossFadeLoadable
          loading={loading}
          error={error}
          minWidth={293}
          minHeight={170}
        >
          <SuccessRequestContent data={data} />
        </CrossFadeLoadable>
      </Box>
    </Box>
  )
}
