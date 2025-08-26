// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import { CanceledError, isAxiosError } from 'axios'

/**
 * Merges the base options with the runtime options.
 * Defaults on the internal abort signal if no abort signal is defined in the resulting merged options.
 * @param baseOptions the global requestOptions
 * @param runtimeOptions the options provided on method call e.g. execute(..., runtimeOptions)
 * @param internal the signal of abort provided internally
 */
export function mergeRequestOptions<Options extends Record<string, unknown>>(
  baseOptions: Options | undefined,
  runtimeOptions: Options | undefined,
  internal: AbortSignal
): Options & { signal: AbortSignal } {
  const b = baseOptions ?? {} as Options
  const r = runtimeOptions ?? {} as Options
  const mergedHeaders = { ...(b.headers ?? {}), ...(r.headers ?? {}) }
  const mergedParams = { ...(b.params ?? {}), ...(r.params ?? {}) }
  const signal = (r.signal ?? b.signal ?? internal) as AbortSignal
  return { ...b, ...r, headers: mergedHeaders, params: mergedParams, signal }
}

/**
 * Identifies whether the error passed is a Canceled error
 * @param e the error
 */
export function isAxiosCancel(e: unknown): boolean {
  return e instanceof CanceledError || (isAxiosError(e) && e.code === 'ERR_CANCELED')
}
