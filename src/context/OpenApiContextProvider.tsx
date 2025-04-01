import React, { createContext, useContext } from 'react'
import { OpenApiProviderProps, OpenApiProviderState } from '../type/openApiConfigurationTypes'

const OpenApiContext = createContext<OpenApiProviderState | undefined>(undefined)

export const OpenApiProvider: React.FC<OpenApiProviderProps> = (
  {
    children, openApiConfigurationMap, defaultConfigurationId
  }
) => {

  return (
    <OpenApiContext.Provider value={{ openApiConfigurationMap: openApiConfigurationMap, defaultConfigurationId }}>
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
