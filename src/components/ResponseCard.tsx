import { Box, Button, darken, Divider, lighten, Palette, Paper, Skeleton, Typography, useTheme } from '@mui/material'
import React from 'react'
import { placeholderData } from '../../mocks/data'
import { FetchData200Response } from '../../open-api-configuration/api'
import { AxiosError, AxiosResponse } from 'axios'
import { FadeLoader } from './FadeLoader'
import JSONPretty from 'react-json-pretty'
import { AsyncStatus } from './AsyncStatus'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { ChipWithAction } from './ChipWithAction'

const successJsonStyle = (palette: Palette) => {
  return {
    mainStyle: `line-height: 1.75em; font-size: 1em; margin: 0; color: #ababab`,
    keyStyle: `color: #43a9e6`,
    stringStyle: `color: ${palette.info.dark}`
  }
}

const errorJsonStyle = (palette: Palette) => {
  return {
    mainStyle: `line-height: 1.75em; font-size: 1em; margin: 0; color: #ababab`,
    keyStyle: `color: ${palette.secondary.main}`,
    stringStyle: `color: ${palette.warning.dark}`
  }
}

interface ResponseContentProps {
  data: FetchData200Response | null | { content: string, licence: string } | unknown
  error?: boolean
}

export const ResponseContent = ({ data, error }: ResponseContentProps) => {
  const { palette } = useTheme()
  return (
    <JSONPretty
      data={data}
      {...(!error ? successJsonStyle(palette) : errorJsonStyle(palette))}
    />
  )
}

const dataPlaceholder = (
  <Skeleton variant="rounded" animation="wave" sx={{ opacity: .5 }}>
    <JSONPretty data={placeholderData} />
  </Skeleton>
)

const dataContent = (response: AxiosResponse | null | undefined, error: AxiosError | null | undefined) => (
  <ResponseContent data={response?.data ?? error?.response?.data ?? placeholderData} error={!!error} />
)


interface SuccessRequestContentProps {
  response?: AxiosResponse | null
  loading?: boolean | null
  error?: AxiosError | null
}


export const ResponseCard = ({
                               response,
                               loading = false,
                               error
                             }: SuccessRequestContentProps) => {
  return (
    <Paper sx={{ pb: .5 }} elevation={3}>
      <ResponseHeader code={response?.status ?? error?.status ?? '---Ï'} loading={loading} />
      <Divider />
      <Box sx={{ m: 2 }}>
        <FadeLoader loading={!!loading} loadComponent={dataPlaceholder} component={dataContent(response, error)} />
      </Box>
    </Paper>
  )
}

interface StatusProps {
  code?: string | number
}

export const StatusBox = ({ code }: StatusProps) => {
  const { palette } = useTheme()
  const colors: Record<string, string> = {
    200: palette.success.light,
    400: palette.warning.light,
    404: palette.secondary.light,
    500: palette.error.light
  }
  const color = colors[code?.toString() ?? ''] ?? palette.action.disabledBackground
  const bg = lighten(color, .7)
  const border = lighten(color, .4)
  const text = darken(color, .3)
  return (
    <Box bgcolor={bg} alignItems="center" display="flex"
         sx={{ px: 1, pt: .5, borderRadius: '4px', border: `1px solid ${border}` }}>
      <Typography sx={{ pb: '2px' }} fontFamily="monospace" color={text} variant="body1">{code}</Typography>
    </Box>
  )
}

const statusContent = (code: string | undefined | number) => (
  <StatusBox code={code} />
)

const statusPlaceholder = (
  <Skeleton variant="rounded" animation="wave" sx={{ opacity: .5 }}>
    <StatusBox code="---" />
  </Skeleton>
)

interface ResponseHeaderProps {
  code?: string | number
  loading?: boolean | null
}

export const ResponseHeader = ({ code, loading = false }: ResponseHeaderProps) => {
  const theme = useTheme()
  return (
    <Box
      display="flex"
      sx={{ py: 1.5, px: 2, borderRadius: '3px 3px 0 0' }}
      bgcolor={(theme) => lighten(theme.palette.action.disabledBackground, .8)}
      gap={.5}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box sx={{ px: 0, pt: 0, mt:'0px' }} display="flex" gap={1.5} alignItems="center" justifyContent="space-between">
        <ChipWithAction
          label="Send request"
          bgColor={lighten(theme.palette.info.light, 0.8)}
          textColor={theme.palette.info.dark}
          onAction={() => console.log('clicked!')}
        />
      </Box>
      <FadeLoader loading={!!loading} loadComponent={statusPlaceholder} component={statusContent(code)} />
    </Box>
  )
}
