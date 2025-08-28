import { FetchData200Response } from '../open-api-configuration/api'

export const successData: FetchData200Response = {
  content: 'I love useApi',
  license: '© 2025 CERN — MIT License'
}
export const notFoundData = {
  content: 'Not found',
  license: '© 2025 CERN — MIT License'
}
export const clientErrorData = {
  content: 'Client error',
  license: '© 2025 CERN — MIT License'
}
export const serverErrorData = {
  content: 'Server error',
  license: '© 2025 CERN — MIT License'
}

export const responseTypes = ['Success', 'Not found', 'Client error', 'Server error'] as const
export type ResponseType = typeof responseTypes[number]

export const responseMap: Record<ResponseType, unknown> = {
  Success: successData,
  'Not found': notFoundData,
  'Client error': clientErrorData,
  'Server error': serverErrorData,
}

export const responseConfig = {
  Success: { status: 200, body: successData },
  'Not found': { status: 404, body: notFoundData },
  'Client error': { status: 400, body: clientErrorData },
  'Server error': { status: 500, body: serverErrorData },
} as const
