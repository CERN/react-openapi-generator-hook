import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import axios, { AxiosInstance } from 'axios'
import { Configuration } from '../types/configuration'

type OpenApiGeneratorConfiguration = {
  configuration: Configuration
  axiosInstance: AxiosInstance
  baseUrl?: string
}

const OpenApiGeneratorConfigurationContext = createContext<OpenApiGeneratorConfiguration>({
  configuration: new Configuration(),
  axiosInstance: axios.create({
    withCredentials: true,
  }),
})

const OpenApiGeneratorConfigurationProvider = ({
                                                 children,
                                                 accessToken
                                               }: {
  readonly children: React.JSX.Element,
  accessToken?: string
}) => {
  const [openApiConfiguration, setOpenApiConfiguration] = useState<Configuration>(new Configuration())
  const openApiAxios: AxiosInstance = axios.create({ withCredentials: true })

  const generateOpenApiConfiguration = (
    conf: Configuration,
    axiosInstance: AxiosInstance,
    url?: string
  ) => ({
    configuration: conf,
    baseUrl: url,
    axiosInstance: axiosInstance,
  })

  const openApiGeneratorConfiguration = useMemo<OpenApiGeneratorConfiguration>(() => {
    if (accessToken) {
      return generateOpenApiConfiguration(openApiConfiguration, openApiAxios)
    } else {
      return generateOpenApiConfiguration(new Configuration(), openApiAxios)
    }
  }, [openApiConfiguration, openApiAxios, accessToken])

  useEffect(() => {
    if (accessToken) {
      setOpenApiConfiguration(new Configuration({ accessToken }))
    }
  }, [accessToken])

  return (
    <OpenApiGeneratorConfigurationContext.Provider value={openApiGeneratorConfiguration}>
      {openApiConfiguration.accessToken && children}
    </OpenApiGeneratorConfigurationContext.Provider>
  )
}

const useOpenApiGenerator = (api?: string): OpenApiGeneratorConfiguration => {
  const context = useContext<OpenApiGeneratorConfiguration>(OpenApiGeneratorConfigurationContext)

  // You can add more sophisticated backend API configuration logic here if needed
  return context
}

export {
  OpenApiGeneratorConfigurationProvider,
  useOpenApiGenerator,
  OpenApiGeneratorConfigurationContext
}
