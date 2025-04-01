import { AxiosInstance } from 'axios'
import { Configuration } from '../../generated/configuration'
import { ReactNode } from 'react'

export interface OpenApiConfigurationType {
  axiosInstance?: AxiosInstance
  configuration?: Configuration
  baseUrl?: string
}

export interface OpenApiProviderProps {
  readonly children: ReactNode
  readonly openApiConfigurationMap: Record<string, OpenApiConfigurationType>
  readonly defaultConfigurationId: string
}

export interface OpenApiProviderState {
  readonly openApiConfigurationMap: Record<string, OpenApiConfigurationType>
  readonly defaultConfigurationId: string
}
