<!--
SPDX-FileCopyrightText: 2025 CERN

SPDX-License-Identifier: MIT
-->

# `react-openapi-generator-hook`

A lightweight React hook utility for calling API methods generated from OpenAPI specifications. Simplify your frontend API integration by using a consistent, declarative hook-based approach — without manually instantiating and managing API clients.

## 🚀 Features

* ⚛️ React-first API interaction with minimal boilerplate
* 🔄 Built-in support for async states: `loading`, `data`, and `error`
* ⚙️ Support for multiple API configurations and endpoints
* ✅ Compatible with OpenAPI Generator's generated `*ApiFactory` functions

## 🧩 Installation

```bash
npm install react-openapi-generator-hook
```

## 🛠️ Basic Usage

```tsx
import { useApi, OpenApiProvider } from 'react-openapi-generator-hook'
import { PetApiFactory, Configuration } from './generated'
import axios from 'axios'

// Setup config
const axiosInstance = axios.create({ withCredentials: true }) // custom headers here
const configMap = {
  PETS: {
    axiosInstance,
    configuration: new Configuration({ accessToken: '1234567890' }),
    baseUrl: 'https://petstore3.swagger.io/api/v3',
  },
  USERS: {
    axiosInstance,
    configuration: new Configuration({ accessToken: '0123456789' }),
    baseUrl: 'https://users.cern.ch/api/v3',
  }
}

// Wrap your app or your components
<OpenApiProvider defaultConfigurationId="PETS" openApiConfigurationMap={configMap}>
  <App />
</OpenApiProvider>
```
Within your component
```tsx
// E.g. PetComponent.tsx
const [{ data, error, loading }, fetchPet] = useApi({
  apiFactory: PetApiFactory,
  methodName: 'getPetById',
  requestParameters: 4,
})

return (
  <div>
    {loading && 'Loading...'}
    {error && <div>Error: {error.message}</div>}
    {data && <div>Pet name: {data.name}</div>}
  </div>
)
```

## 📦 API

### `useApi`

A custom hook for invoking a specific API method from an OpenAPI-generated factory.

**Parameters:**

```ts
{
  apiFactory: (config: Configuration) => any,     // The API factory to use
  methodName: string,                             // Name of the method to invoke
  requestParameters?: any,                        // Parameters to pass to the method
},
{
  manual?: boolean                                // if true, does not send request on component mount
  configurationId?: string                        // (Optional) Configuration key to use
}
```

**Returns:**

```ts
[
  { data, error, loading },  // Result state
  refetch                    // Function to manually re-trigger the call
]
```

### `OpenApiProvider`

A context provider that supplies configuration for all `useApi` calls.

**Props:**

* `defaultConfigurationId: string` – (optional) the default API to use
* `openApiConfigurationMap: Record<string, OpenApiConfigurationType>` – a map of configurations:

    * `axiosInstance`: Axios instance to use
    * `configuration`: OpenAPI `Configuration` object (with accessToken, etc.)
    * `baseUrl`: Base URL of the API


You can also extend this setup to dynamically refresh tokens or inject headers as needed via `axios`.

## 🧪 Example Project

A guided example project showing how to use the hook is available here:
👉 [react-openapi-generator-hook-demo](./examples/demo)

## 🧱 Built With

* [React](https://reactjs.org)
* [Axios](https://axios-http.com)
* [OpenAPI Generator](https://openapi-generator.tech/)

## 📃 License

MIT © CERN
