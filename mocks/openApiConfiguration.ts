// This map is used to provide default configuration for each backend API
import { OpenApiConfigurationType } from '../src/type/openApiConfigurationTypes'
import axios from 'axios'

const axiosSingleton = axios.create({})

export const openApiConfigurationMap: Record<string, OpenApiConfigurationType> = {
  'PRIMARY': { axiosInstance: axiosSingleton, baseUrl: '/mocks' },
  'SECONDARY': { axiosInstance: axiosSingleton },
}
