// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import { useApi } from './useApi'
import { act, renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { createOpenApiTestWrapper } from '../../test/test-wrappers'
import { type AxiosError } from 'axios'
import { Configuration } from '../../open-api-configuration/configuration'

type MethodName = 'fetchData'
type Data = { ok: boolean }
type ApiMethod = (params?: unknown, options?: unknown) => Promise<{ data: Data }>
type MockApiType = Record<MethodName, ApiMethod>

describe('useApi', () => {
  const apiFactory = vi.fn()
  const methodName = 'testMethod'
  const requestParameters = { param1: 'value1' }
  const requestOptions = { option1: 'value1' }
  const wrapper = createOpenApiTestWrapper()

  it('should initialize with default values', () => {
    apiFactory.mockReturnValue({ [methodName]: vi.fn() })
    const { result } = renderHook(() =>
      useApi({
        apiFactory,
        methodName,
        requestParameters,
        requestOptions,
      }),
    { wrapper }
    )

    const [state] = result.current
    expect(state.data).toBeNull()
    expect(state.error).toBeNull()
    expect(state.loading).toBe(true)
  })

  it('should execute API call and update state', async () => {
    const mockResponse = { data: { result: 'success' } }
    const method = vi.fn().mockResolvedValue(mockResponse)
    apiFactory.mockReturnValue({ [methodName]: method })

    const { result } = renderHook(() =>
      useApi({
        apiFactory,
        methodName,
        requestParameters,
        requestOptions,
      }),
    { wrapper }
    )

    const [, execute] = result.current

    await act(async () => {
      await execute()
    })

    await waitFor(() => {
      const [state] = result.current
      expect(state.loading).toBe(false)
    })

    const [state] = result.current
    expect(state.data).toEqual(mockResponse.data)
    expect(state.error).toBeNull()
    expect(state.loading).toBe(false)
  })

  it('should not execute API call if manual option is true', () => {
    const method = vi.fn()
    apiFactory.mockReturnValue({ [methodName]: method })

    renderHook(
      () =>
        useApi(
          {
            apiFactory,
            methodName,
            requestParameters,
            requestOptions,
          },
          { manual: true }
        ),
      { wrapper }
    )
    expect(method).not.toHaveBeenCalled()
  })

  it('should throw if used outside OpenApiProvider', () => {
    expect(() =>
      renderHook(() =>
        useApi(
          {
            apiFactory,
            methodName,
            requestParameters,
            requestOptions,
          },
          { manual: true }
        )
      )
    ).toThrowError(/must be used within an OpenApiProvider/)
  })

  it('sets error and rethrows on non-cancel error', async () => {
    // Fake API instance with a method that rejects
    const methodName = 'fetchData' as const
    const apiFactory = vi.fn(() => ({
      [methodName]: vi.fn().mockRejectedValue(Object.assign(new Error('Boom'), {
        isAxiosError: true,
      } satisfies Partial<AxiosError>)),
    }))
    const wrapper = createOpenApiTestWrapper()

    const { result } = renderHook(() =>
      useApi({ apiFactory, methodName }, { manual: true }),
    { wrapper }
    )

    const [, execute] = result.current

    await act(async () => {
      await expect(execute()).rejects.toThrow('Boom')
    })

    const [state] = result.current
    expect(state.loading).toBe(false)
    expect(state.error).toBeTruthy()
    expect(state.error?.message).toBe('Boom')
    expect(state.data).toBeNull()
  })

  it('uses the secondary configuration when specified', async () => {
    const methodName = 'fetchData' as const
    const wrapper =
      createOpenApiTestWrapper({ configurationId: undefined, defaultConfigurationId: 'secondaryConfiguration' })

    const method = vi.fn().mockResolvedValue({ data: { ok: true } })
    const apiFactory = vi.fn((_cfg?: Configuration, basePath?: string, _axiosInstance?: unknown) => {
      expect(basePath).toBe('https://secondary.example')
      return { 'fetchData': method } satisfies MockApiType
    })
    renderHook(
      () =>
        useApi(
          {
            apiFactory,
            methodName,
            requestParameters,
            requestOptions,
          },
          { manual: true }
        ),
      { wrapper }
    )
  })

  it('uses the first configuration in the map when no configurationId and no defaultConfigurationId specified',
    async () => {
      const methodName = 'fetchData' as const
      const wrapper = createOpenApiTestWrapper({ configurationId: undefined, defaultConfigurationId: undefined })

      const method = vi.fn().mockResolvedValue({ data: { ok: true } })
      const apiFactory = vi.fn((_cfg?: Configuration, basePath?: string, _axiosInstance?: unknown) => {
        expect(basePath).toBe('https://primary.example')
        return { 'fetchData': method } satisfies MockApiType
      })
      renderHook(
        () => useApi(
          {
            apiFactory,
            methodName,
            requestParameters,
            requestOptions,
          },
          { manual: true }
        ),
        { wrapper }
      )
    })
})
