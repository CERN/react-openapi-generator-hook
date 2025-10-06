import type { Meta, StoryObj } from '@storybook/react-vite'
import { FireOnMount } from '../components/FireOnMount'
import { delay, http, HttpResponse } from 'msw'
import { openApiConfigurationMap } from '../../mocks/openApiConfiguration'
import { OpenApiProvider } from '../context/OpenApiContextProvider'
import { responseConfig } from '../../mocks/data'

const meta = {
  title: 'Components/FireOnMount',
  component: FireOnMount,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      context.parameters.msw = {
        handlers: [
          http.get('mocks/data', async ({ request }) => {
            const url = new URL(request.url)
            const ms = Number(url.searchParams.get('delay') ?? 0)
            const code = String(url.searchParams.get('status') ?? '200') as keyof typeof responseConfig
            const { status, body } = responseConfig[code]
            await delay(ms)
            return HttpResponse.json(body, { status })
          })
        ]
      }

      return (
        <OpenApiProvider openApiConfigurationMap={openApiConfigurationMap}>
          <Story />
        </OpenApiProvider>
      )
    }
  ]
} satisfies Meta<typeof FireOnMount>

export default meta
type Story = StoryObj<typeof meta>

export const ComponentOnMount: Story = {
  args: {
    delay: 0,
    responseType: Object.keys(responseConfig)[0]
  },
  argTypes: {
    responseType: {
      options: Object.keys(responseConfig),
      control: { type: 'select' }
    }
  }
}
