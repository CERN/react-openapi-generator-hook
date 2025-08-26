import type { Meta, StoryObj } from '@storybook/react-vite'
import { FireOnMount } from './FireOnMount'
import { delay, http, HttpResponse } from 'msw'
import { openApiConfigurationMap } from '../../mocks/openApiConfiguration'
import { OpenApiProvider } from '../context/OpenApiContextProvider'

const meta = {
  title: 'Components/FireOnMount',
  component: FireOnMount,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get('mocks/data', async () => {
          await delay(2000) // 2s delay
          return HttpResponse.json({ content: 'I love useApi', licence: 'MIT ©CERN' })
        })
      ]
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <OpenApiProvider openApiConfigurationMap={openApiConfigurationMap}>
        <Story />
      </OpenApiProvider>
    )
  ]
} satisfies Meta<typeof FireOnMount>

export default meta
type Story = StoryObj<typeof meta>

export const ComponentOnMount: Story = {
  args: {
    primary: false,
    label: 'FireOnMount'
  }
}
