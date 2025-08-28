// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AxiosError, AxiosInstance, AxiosResponse, isAxiosError } from 'axios'
import { useOpenApiGenerator } from '../context/OpenApiContextProvider'
import { Configuration } from '../../open-api-configuration/configuration'
import { isAxiosCancel, mergeRequestOptions } from '../helpers/helpers'

export function useApi<
  ApiFactory,
  MethodName extends keyof ApiFactory &(string | number | symbol)
>(
  apiParams: {
    apiFactory: (
      configuration?: Configuration,
      basePath?: string,
      axios?: AxiosInstance
    ) => ApiFactory
    methodName: MethodName
    requestParameters?: ApiFactory[MethodName] extends (...args: infer Args) => Promise<infer _Return>
      ? Args[1] extends undefined // Check if Args[1] exists
        ? undefined // If Args[1] doesn't exist, set requestParameters to undefined
        : Args[0] // If Args[1] exists, set requestParameters to Args[0]
      : never
    requestOptions?: ApiFactory[MethodName] extends (...args: infer Args) => Promise<infer _Return>
      ? Args[1] extends undefined // Check if Args[1] exists
        ? Args[0] // If Args[1] doesn't exist, set requestOptions to Args[0]
        : Args[1] // If Args[1] exists, set requestOptions to Args[1]
      : never
  },
  options?: {
    manual?: boolean
    configurationId?: string
  }
) {
  const { apiFactory, methodName, requestParameters, requestOptions } = apiParams

  type Method = ApiFactory[MethodName] extends (...args: infer Args) =>
    infer Return ? (...args: Args) => Return : never
  type Params = typeof requestParameters
  type Options = typeof requestOptions
  type Response = Awaited<ReturnType<Method>> extends { data: infer D } ? D : never

  const [response, setResponse] = useState<AxiosResponse<Response> | null>(null)
  const [error, setError] = useState<AxiosError | null>(null)
  const [loading, setLoading] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const reqIdRef = useRef(0)

  const abort = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
  }, [])

  const { openApiConfigurationMap, defaultConfigurationId } = useOpenApiGenerator()
  const { axiosInstance, configuration, baseUrl } =
    openApiConfigurationMap[options?.configurationId
    ?? defaultConfigurationId ?? Object.keys(openApiConfigurationMap)[0]]

  const apiInstance = useMemo(
    () => apiFactory(configuration, baseUrl, axiosInstance),
    [configuration, baseUrl, axiosInstance, apiFactory]
  )

  const execute = useCallback(
    async (params?: Params, options?: Options): Promise<AxiosResponse<Response>> => {
      abort()
      abortRef.current = new AbortController()
      const myReqId = ++reqIdRef.current

      setLoading(true)
      setError(null)
      try {
        const method = apiInstance[methodName] as Method
        const mergedOptions = mergeRequestOptions<Options & { signal: AbortSignal }>(
          requestOptions as Options & { signal: AbortSignal } | undefined,
          options as Options & { signal: AbortSignal } | undefined,
          abortRef.current.signal
        )
        const response = await (params !== undefined
          ? method(params, mergedOptions)
          : method(mergedOptions)) as AxiosResponse<Response>

        if (reqIdRef.current === myReqId) {
          setResponse(response)
        }
        return response
      } catch (error) {
        if (isAxiosError(error) || isAxiosCancel(error)) {
          setError(error as AxiosError)
        } else {
          // Not to lose actual error information
          console.error(error)
          // not an Axios error: map to a generic AxiosError with custom error code
          setError(new AxiosError('Unexpected useApi error', 'UNCATEGORIZED_ERROR'))
        }
        throw error
      } finally {
        if (reqIdRef.current === myReqId) {
          setLoading(false)
        }
      }
    },
    [apiInstance, methodName, requestOptions, abort]
  )

  /**
   * Execute request on component mount if option.manual !== true
   */
  useEffect(() => {
    if (!options?.manual) {
      execute(requestParameters, requestOptions).catch(() => {
        // Intentionally discarding errors for the auto-execution case
        // because execute already sets the error state inside the hook
      })
    }
  }, [requestParameters, requestOptions, options?.manual, execute])

  /**
   * abort if the api instance (or method) identity changes while a request is in flight
   */
  useEffect(() => {
    return () => abort()
  }, [options?.configurationId, apiInstance, methodName])

  const data = response?.data

  return [{ response, data, error, loading }, execute, abort] as const
}
