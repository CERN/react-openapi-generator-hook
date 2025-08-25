// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import React, { PropsWithChildren } from 'react'
import axios from 'axios'
import { Configuration } from '../open-api-configuration/configuration'
import { OpenApiProvider } from '../src/context/OpenApiContextProvider'

export function createOpenApiTestWrapper(opts?: {
  configurationId?: string
  baseUrl?: string
  defaultConfigurationId?: string
}) {
  const configurationId = opts?.configurationId
  const primaryConfigurationId = 'primaryConfiguration'
  const secondaryConfigurationId = 'secondaryConfiguration'

  const primary = {
    axiosInstance: axios.create(),
    configuration: new Configuration({ basePath: 'https://primary.example' }),
    baseUrl: 'https://primary.example',
  }
  const secondary = {
    axiosInstance: axios.create(),
    configuration: new Configuration({ basePath: 'https://secondary.example' }),
    baseUrl: 'https://secondary.example',
  }

  const openApiConfigurationMap = {
    [primaryConfigurationId]: primary,
    [secondaryConfigurationId]: secondary,
  }

  const defaultConfigurationId = configurationId ?? opts?.defaultConfigurationId

  return ({ children }: PropsWithChildren) => (
    <OpenApiProvider
      openApiConfigurationMap={openApiConfigurationMap}
      defaultConfigurationId={defaultConfigurationId}
    >
      {children}
    </OpenApiProvider>
  )
}
