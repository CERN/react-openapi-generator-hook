import { useCallback, useEffect, useMemo, useState } from 'react'
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { useOpenApiGenerator } from '../context/OpenApiContextProvider'
import { Configuration } from '../../generated/configuration'

export function useApi<
  ApiInstance,
  MethodName extends keyof ApiInstance &(string | number | symbol)
>(
  apiParams: {
    apiFactory: (
      configuration?: Configuration,
      basePath?: string,
      axios?: AxiosInstance
    ) => ApiInstance
    methodName: MethodName
    requestParameters?: ApiInstance[MethodName] extends (...args: infer Args) => Promise<infer _Return>
      ? Args[1] extends undefined // Check if Args[1] exists
        ? undefined // If Args[1] doesn't exist, set requestParameters to undefined
        : Args[0] // If Args[1] exists, set requestParameters to Args[0]
      : never
    requestOptions?: ApiInstance[MethodName] extends (...args: infer Args) => Promise<infer _Return>
      ? Args[1] extends undefined // Check if Args[1] exists
        ? Args[0] // If Args[1] doesn't exist, set requestOptions to Args[0]
        : Args[1] // If Args[1] exists, set requestOptions to Args[1]
      : never
  },
  options?: {
    manual?: boolean
    configurationId?: string
  },
) {
  const { apiFactory, methodName, requestParameters, requestOptions } = apiParams

  type Method = ApiInstance[MethodName] extends (...args: infer Args) =>
    infer Return ? (...args: Args) => Return : never
  type Params = typeof requestParameters
  type Options = typeof requestOptions
  type Response = Awaited<ReturnType<Method>> extends { data: infer D } ? D : never

  const [data, setData] = useState<Response | null>(null)
  const [error, setError] = useState<AxiosError | null>(null)
  const [loading, setLoading] = useState(false)

  const { openApiConfigurationMap, defaultConfigurationId } = useOpenApiGenerator()
  const { axiosInstance, configuration, baseUrl } = openApiConfigurationMap[
    options?.configurationId ?? defaultConfigurationId]

  const apiInstance = useMemo(
    () => apiFactory(configuration, baseUrl, axiosInstance),
    [configuration, baseUrl, axiosInstance]
  )

  const memoisedRequestParams = useMemo(
    () => requestParameters,
    [requestParameters]
  )

  const memoisedRequestOptions = useMemo(
    () => requestOptions,
    [requestOptions]
  )

  const execute = useCallback(
    async (params?: Params, options?: Options): Promise<AxiosResponse<Response>> => {
      setLoading(true)
      setError(null)
      try {
        const method = apiInstance[methodName] as Method
        const requestOptions = options ?? memoisedRequestOptions
        const response = await (params !== undefined
          ? method(params ?? memoisedRequestParams, requestOptions)
          : method(requestOptions)) as AxiosResponse<Response>
        setData(response?.data)
        return response
      } catch (err) {
        setError(err as AxiosError)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiInstance, methodName, memoisedRequestParams, memoisedRequestOptions]
  )

  useEffect(() => {
    if (!options?.manual) {
      if (memoisedRequestParams) {
        execute(memoisedRequestParams, memoisedRequestOptions).then(_ => {})
      } else {
        execute(undefined, memoisedRequestOptions).then(_ => {})
      }
    }
  }, [memoisedRequestParams, execute, options, memoisedRequestOptions])
  return [{ data, error, loading }, execute] as const
}
