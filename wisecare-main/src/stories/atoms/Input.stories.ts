import { Meta, StoryObj } from '@storybook/react/*'
import { Input } from '../../components/ui/input'

const meta: Meta = {
  title: 'Atoms/ShadCN/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Input',
  },
}
