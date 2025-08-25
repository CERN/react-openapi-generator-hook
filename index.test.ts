// SPDX-FileCopyrightText: 2025 CERN
//
// SPDX-License-Identifier: MIT

import * as lib from './index'

describe('package public API', () => {
  it('should export types and hooks', () => {
    expect(lib.useApi).toBeTypeOf('function')
    expect(lib.useOpenApiGenerator).toBeTypeOf('function')
    expect(lib.OpenApiProvider).toBeDefined()
  })
})

/**
 * Checks that index exports the types needed
 * if the exports don’t exist, this test file won’t compile
 */
import type {
  OpenApiProviderProps,
  OpenApiProviderState,
} from './index'

declare const _check: [
  OpenApiProviderProps,
  OpenApiProviderState,
]
