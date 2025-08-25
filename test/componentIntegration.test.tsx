// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import { useApi } from '../src/hook/useApi'
import { DefaultApi } from '../open-api-configuration/api'
import { createOpenApiTestWrapper } from './test-wrappers'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe } from 'vitest'
import { CanceledError } from 'axios'

export function makePendingMethodRejectOnAbort() {
  return vi.fn((...args: any[]) => {
    const maybeOpts = args.length === 1 ? args[0] : args[1]
    const signal: AbortSignal | undefined = maybeOpts?.signal

    return new Promise((_resolve, reject) => {
      const cancelErr = Object.assign(new CanceledError('canceled'), {
        code: 'ERR_CANCELED',
        name: 'AbortError',
      })
      const onAbort = () => reject(cancelErr)

      if (signal?.aborted) return onAbort()
      signal?.addEventListener('abort', onAbort, { once: true })
      // never resolve unless aborted (simulates a long request)
    })
  })
}

type Props = {

  readonly apiFactory: any
  readonly methodName: 'fetchData'
  readonly manual?: boolean
  readonly requestParameters?: any
  readonly requestOptions?: any
}

export const TestConsumer = ({
  apiFactory,
  methodName,
  manual = true,
  requestParameters,
  requestOptions,
}: Props) => {
  const [{ data, error, loading }, execute, abort] = useApi<DefaultApi, 'fetchData'>(
    { apiFactory, methodName, requestParameters, requestOptions },
    { manual }
  )
  return (
    <div>
      {loading && <div data-testid="loading">loading…</div>}
      {error && <div data-testid="error">{error.message}</div>}
      {data && <pre data-testid="data">{JSON.stringify(data)}</pre>}

      <button
        data-testid="start"
        onClick={() => execute().catch(() => {
        })}
      >
        Start
      </button>
      <button data-testid="cancel" onClick={() => abort()}>
        Cancel
      </button>
    </div>
  )
}

const wrapper = createOpenApiTestWrapper()

describe('Run component integration tests', () => {
  it('shows loading then data on success', async () => {
    const methodName = 'fetchData'
    const method = vi.fn().mockResolvedValue({ data: { ok: true } })
    const apiFactory = vi.fn(() => ({ [methodName]: method }))

    render(<TestConsumer apiFactory={apiFactory} methodName={methodName} />, { wrapper })

    fireEvent.click(screen.getByTestId('start'))
    expect(screen.getByTestId('loading')).toBeInTheDocument()

    await act(async () => {}) // flush microtasks
    expect(await screen.findByTestId('data')).toHaveTextContent('{"ok":true}')
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })

  it('shows error and clears loading on failure', async () => {
    const methodName = 'fetchData'
    const err = Object.assign(new Error('Boom'), { isAxiosError: true })
    const method = vi.fn().mockRejectedValue(err)
    const apiFactory = vi.fn(() => ({ [methodName]: method }))

    render(<TestConsumer apiFactory={apiFactory} methodName={methodName} />, { wrapper })

    fireEvent.click(screen.getByTestId('start'))
    expect(screen.getByTestId('loading')).toBeInTheDocument()

    // ensure Promise rejection is processed
    await act(async () => {})
    expect(await screen.findByTestId('error')).toHaveTextContent('Boom')
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('data')).not.toBeInTheDocument()
  })

  it('cancels request and does not set error on abort', async () => {
    const methodName = 'fetchData'
    const method = makePendingMethodRejectOnAbort()
    const apiFactory = vi.fn(() => ({ [methodName]: method }))

    render(<TestConsumer apiFactory={apiFactory} methodName={methodName} />, { wrapper })

    fireEvent.click(screen.getByTestId('start'))
    expect(screen.getByTestId('loading')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('cancel'))

    // let the rejection from abort propagate
    await act(async () => {})
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('data')).not.toBeInTheDocument()
  })

  it('auto-executes on mount when manual=false', async () => {
    const methodName = 'fetchData'
    const method = vi.fn().mockResolvedValue({ data: { ok: 123 } })
    const apiFactory = vi.fn(() => ({ [methodName]: method }))
    render(
      <TestConsumer apiFactory={apiFactory} manual={false} methodName={methodName} />,
      { wrapper }
    )
    // initial effect should flip loading true
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    await act(async () => {})
    expect(await screen.findByTestId('data')).toHaveTextContent('123')
  })
})

