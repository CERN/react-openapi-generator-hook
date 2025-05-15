// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import { useApi } from './useApi'
import { act, renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

describe('useApi', () => {
  const apiFactory = vi.fn()
  const methodName = 'testMethod'
  const requestParameters = { param1: 'value1' }
  const requestOptions = { option1: 'value1' }

  it('should initialize with default values', () => {
    apiFactory.mockReturnValue({ [methodName]: vi.fn() })
    const { result } = renderHook(() =>
      useApi({
        apiFactory,
        methodName,
        requestParameters,
        requestOptions,
      })
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
      })
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

    expect(method).not.toHaveBeenCalled()
  })
})
