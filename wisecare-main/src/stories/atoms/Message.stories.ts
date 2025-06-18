import { Meta, StoryObj } from '@storybook/react/*'
import Message from '../../components/message'

const meta: Meta = {
  title: 'atoms/Message',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Message>

export const Default: Story = {
  args: {
    children: 'Hello World',
    variant: 'default',
  },
}

export const Error: Story = {
  args: {
    children: 'Hello World',
    variant: 'error',
  },
}
