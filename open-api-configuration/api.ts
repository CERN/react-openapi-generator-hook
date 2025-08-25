import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig, AxiosResponse } from 'axios'
import globalAxios from 'axios'
import { Configuration } from './configuration'

type RequestArgs = {
    url: string
    options: RawAxiosRequestConfig
}

type ServerMap = {
    [key: string]: { url: string; description: string }[]
}

const operationServerMap: ServerMap = {}

function setFlattenedQueryParams(urlSearchParams: URLSearchParams, parameter: any, key = ''): void {
  if (parameter == null) return
  if (typeof parameter === 'object') {
    if (Array.isArray(parameter)) {
      ;(parameter as any[]).forEach(item => setFlattenedQueryParams(urlSearchParams, item, key))
    } else {
      Object.keys(parameter).forEach(currentKey =>
        setFlattenedQueryParams(
          urlSearchParams,
          parameter[currentKey],
          `${key}${key !== '' ? '.' : ''}${currentKey}`
        )
      )
    }
  } else {
    if (urlSearchParams.has(key)) urlSearchParams.append(key, parameter)
    else urlSearchParams.set(key, parameter)
  }
}

const setSearchParams = (url: URL, ...objects: any[]) => {
  const searchParams = new URLSearchParams(url.search)
  setFlattenedQueryParams(searchParams, objects)
  url.search = searchParams.toString()
}

const toPathString = (url: URL) => url.pathname + url.search + url.hash

const createRequestFunction = (
  axiosArgs: RequestArgs,
  globalAxiosInst: AxiosInstance,
  BASE_PATH: string,
  configuration?: Configuration
) => {
  return <T = unknown, R = AxiosResponse<T>>(
    axios: AxiosInstance = globalAxiosInst,
    basePath: string = BASE_PATH
  ) => {
    const axiosRequestArgs = {
      ...axiosArgs.options,
      url: (axios.defaults.baseURL ? '' : configuration?.basePath ?? basePath) + axiosArgs.url,
    }
    return axios.request<T, R>(axiosRequestArgs)
  }
}

class BaseAPI {
  protected configuration: Configuration | undefined

  constructor(
    configuration?: Configuration,
      protected basePath: string = 'http://example',
      protected axios: AxiosInstance = globalAxios
  ) {
    if (configuration) {
      this.configuration = configuration
      this.basePath = configuration.basePath ?? basePath
    }
  }
}

export const DefaultApiAxiosParamCreator = (configuration?: Configuration) => ({
  fetchData: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
    const localVarPath = `/data`
    const localVarUrlObj = new URL(localVarPath, 'http://example')
    let baseOptions
    if (configuration) baseOptions = configuration.baseOptions

    const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options }
    const localVarHeaderParameter = {} as any
    const localVarQueryParameter = {} as any

    setSearchParams(localVarUrlObj, localVarQueryParameter)
    const headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {}
    localVarRequestOptions.headers = {
      ...localVarHeaderParameter,
      ...headersFromBaseOptions,
      ...options.headers,
    }

    return {
      url: toPathString(localVarUrlObj),
      options: localVarRequestOptions,
    }
  },
})

export const DefaultApiFp = (configuration?: Configuration) => {
  const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
  return {
    async fetchData(
      options?: RawAxiosRequestConfig
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.fetchData(options)
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0
      const localVarOperationServerBasePath =
              operationServerMap['DefaultApi.fetchData']?.[localVarOperationServerIndex]?.url
      return (axios, basePath) =>
        createRequestFunction(localVarAxiosArgs, globalAxios, 'http://example', configuration)(
          axios,
          localVarOperationServerBasePath || basePath
        )
    },
  }
}

export type DefaultApiFp = typeof DefaultApiFp

export class DefaultApi extends BaseAPI {
  fetchData(options?: RawAxiosRequestConfig) {
    return DefaultApiFp(this.configuration).fetchData(options).then(request => request(this.axios, this.basePath))
  }
}
