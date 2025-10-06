import * as React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { lighten } from '@mui/material/styles'
import SendRoundedIcon from '@mui/icons-material/SendRounded'

type ChipWithActionProps = {
  label: string
  onAction?: () => void
  icon?: React.ReactNode
  bgColor?: string
  textColor?: string
}

export function ChipWithAction({
                                 label,
                                 onAction,
                                 icon = <SendRoundedIcon sx={{fontSize: 16}} />,
                                 bgColor,
                                 textColor,
                               }: ChipWithActionProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '16px',
        p: .75,
        backgroundColor: bgColor,
        color: textColor,
        fontSize: 13,
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500, px: 0.5, pt: .25 }}>
        {label}
      </Typography>

      <IconButton
        size="small"
        onClick={onAction}
        sx={{
          width: '24px',
          height: '24px',
          ml: 0.5,
          borderRadius: '100%',
          color: textColor,
          backgroundColor: lighten(bgColor || '#000', 0.5),
          '&:hover': {
            backgroundColor: lighten(bgColor || '#000', 0.7),
          },
        }}
      >
        {icon}
      </IconButton>
    </Box>
  )
}
