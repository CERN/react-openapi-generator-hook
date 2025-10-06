import { Box, Fade } from '@mui/material'
import { ReactElement } from 'react'

type FadeLoaderProps = {
  loading: boolean
  timeout?: number | { enter?: number; exit?: number }
  loadComponent: ReactElement
  component: ReactElement
}

const layerSx = {
  gridArea: '1 / 1 / -1 / -1', // all children stack on the same grid cell
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

export function FadeLoader({
                             loading,
                             timeout = 300,
                             loadComponent,
                             component
                           }: FadeLoaderProps) {
  return (
    <Box
      sx={{
        display: 'grid',          // single-cell grid
        placeItems: 'center',     // ensure center alignment
        width: 'fit-content',     // shrink-wrap to children
        height: 'fit-content'
      }}
      aria-live="polite"
      aria-busy={loading || undefined}
    >
      <Fade in={loading} unmountOnExit timeout={timeout}>
        <Box sx={layerSx}>
          {loadComponent}
        </Box>
      </Fade>

      <Fade in={!loading} unmountOnExit timeout={timeout}>
        <Box sx={layerSx}>
          {component}
        </Box>
      </Fade>
    </Box>
  )
}
