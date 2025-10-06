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
export const placeholderData = {
  content: 'No HTTP request sent',
  license: '© 2025 CERN — MIT License'
}

export const abortData = {
  content: 'HTTP request cancelled',
  license: '© 2025 CERN — MIT License'
}

export const responseConfig = {
  '200': { status: 200, body: successData, color: 'success' },
  '404': { status: 404, body: notFoundData, color: 'warning' },
  '400': { status: 400, body: clientErrorData, color: 'error' },
  '500': { status: 500, body: serverErrorData, color: 'error' },
} as const

