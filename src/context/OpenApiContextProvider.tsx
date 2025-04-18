import React, { createContext, useContext, useMemo } from 'react'
import { OpenApiProviderProps, OpenApiProviderState } from '../type/openApiConfigurationTypes'

const OpenApiContext = createContext<OpenApiProviderState | undefined>(undefined)

export const OpenApiProvider: React.FC<OpenApiProviderProps> = ({
  children,
  openApiConfigurationMap,
  defaultConfigurationId,
}) => {
  const contextValue = useMemo(() => ({
    openApiConfigurationMap,
    defaultConfigurationId,
  }), [openApiConfigurationMap, defaultConfigurationId])

  return (
    <OpenApiContext.Provider value={contextValue}>
      {children}
    </OpenApiContext.Provider>
  )
}

export const useOpenApiGenerator = (): OpenApiProviderState => {
  const context = useContext(OpenApiContext)
  if (context === undefined) {
    throw new Error('useApi and useOpenApiGenerator must be used within an OpenApiProvider')
  }
  return context
}
