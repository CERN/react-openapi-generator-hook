import React from 'react'

import './style.css'
import { useApi } from '../hook/useApi'
import { DefaultApiFactory } from '../../generated'
import { OpenApiProvider } from '../context/OpenApiContextProvider'
import { openApiConfigurationMap } from '../../mocks/openApiConfiguration'
import { Box, Chip, Divider, lighten, Paper, Skeleton, Typography, useTheme } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export const FireOnMount = () => {

  const theme = useTheme()

  const [{ data, error, loading }] = useApi({
    apiFactory: DefaultApiFactory,
    methodName: 'fetchData'
  })
  return (
    <OpenApiProvider openApiConfigurationMap={openApiConfigurationMap}>
      <Box>
        <Box display="flex" gap={2}>
          <Chip label="GET" color="secondary" />
          <Typography variant="h4">/mocks/data</Typography>
          <CheckCircleIcon color="primary" />
        </Box>

        <Box>
          {
            loading
              ? <Skeleton height={170} width={293} sx={{ m: 0 }} />
              : (
                <Paper sx={{ my: 2, pb: 1 }}>
                  <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{ pt: 1, pb: .5, borderRadius: '3px 3px 0 0' }}
                    bgcolor={lighten(theme.palette.action.disabledBackground, .8)}
                  >
                    HTTP Response
                  </Typography>
                  <Divider />
                  <pre style={{
                    fontSize: '1.25em',
                    lineHeight: '1.75em',
                    padding: '0 16px'
                  }}>{JSON.stringify(data, null, 2)}</pre>
                </Paper>
              )
          }
        </Box>
      </Box>
    </OpenApiProvider>
  )
}
