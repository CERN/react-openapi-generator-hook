import type { Meta, StoryObj } from '@storybook/react-vite'
import { FireOnMount } from '../components/FireOnMount'
import { delay, http, HttpResponse } from 'msw'
import { openApiConfigurationMap } from '../../mocks/openApiConfiguration'
import { OpenApiProvider } from '../context/OpenApiContextProvider'
import { responseConfig, responseTypes } from '../../mocks/data'

const meta = {
  title: 'Components/FireOnMount',
  component: FireOnMount,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const { delay: mswDelay } = context.args as { delay?: number }
      const { responseType } = context.args as { responseType: keyof typeof responseConfig }
      const { status, body } = responseConfig[responseType]
      context.parameters.msw = {
        handlers: [
          http.get('mocks/data', async () => {
            await delay(mswDelay ?? 0)
            return HttpResponse.json(body, { status })
          }),
        ],
      }

      return (
        <OpenApiProvider openApiConfigurationMap={openApiConfigurationMap}>
          <Story />
        </OpenApiProvider>
      )
    },
  ],
} satisfies Meta<typeof FireOnMount>

export default meta
type Story = StoryObj<typeof meta>

export const ComponentOnMount: Story = {
  args: {
    delay: 2000,
    responseType: 'Success'
  },
  argTypes: {
    responseType: {
      options: responseTypes,
      control: { type: 'select' },
    }
  }
}
