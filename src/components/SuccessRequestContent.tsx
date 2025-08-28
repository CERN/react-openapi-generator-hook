import { Box, darken, Divider, lighten, Paper, Typography, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'
import { successData } from '../../mocks/data'
import { FetchData200Response } from '../../open-api-configuration/api'

interface SuccessRequestContentProps {
  data?: FetchData200Response | null
}

export const SuccessRequestContent = ({ data = successData }: SuccessRequestContentProps) => {
  return (
    <SuccessPaper>
      <SuccessHeader />
      <Divider />
      <Box sx={{ m: 2 }}>
        <SuccessContent data={data} />
      </Box>
    </SuccessPaper>
  )
}

interface SuccessPaperProps {
  children: ReactNode
}

export const SuccessPaper = ({ children }: SuccessPaperProps) => {
  return (
    <Paper sx={{ pb: .5 }} elevation={3}>
      {children}
    </Paper>
  )
}

export const SuccessHeader = () => {
  return (
    <Box
      display="flex"
      sx={{ py: 1.5, px: 2, borderRadius: '3px 3px 0 0' }}
      bgcolor={(theme) => lighten(theme.palette.action.disabledBackground, .8)}
      gap={.5}
      justifyContent="space-between"
    >
      <Box sx={{ px: 0, pt: .5 }}>
        <Typography variant="body1" fontWeight={800} textAlign="center">
          HTTP Response
        </Typography>
      </Box>
      <StatusBox code="200" />
    </Box>
  )
}

interface SuccessContentProps {
  data: FetchData200Response | null
}

export const SuccessContent = ({ data }: SuccessContentProps) => {
  return (
    <pre style={{ fontSize: '1em', lineHeight: '1.75em', margin: '0px' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}

interface StatusBoxProps {
  code: string | number
}

export const StatusBox = ({ code }: StatusBoxProps) => {
  const { palette } = useTheme()
  const colors: Record<string, string> = {
    200: palette.success.light,
    400: palette.warning.light,
    404: palette.secondary.light,
    500: palette.error.light
  }
  const color = colors[code.toString()] ?? palette.action.disabledBackground
  const bg = lighten(color, .7)
  const border = lighten(color, .4)
  const text = darken(color, .3)
  return (
    <Box bgcolor={bg} alignItems="center" display="flex"
         sx={{ px: 1, pt: .5, borderRadius: '4px', border: `1px solid ${border}` }}>
      <Typography color={text} variant="caption">{code}</Typography>
    </Box>
  )
}
