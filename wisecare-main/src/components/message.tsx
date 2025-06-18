import { cva, VariantProps } from 'class-variance-authority'
import { FC, forwardRef, ReactNode } from 'react'
import { cn } from '../utils/tailwind'

const messageVariants = cva('p-4 rounded-lg bg-primary text-sm', {
  variants: {
    variant: {
      default: 'bg-[#eff6ff] border border-primary/80 text-primary-[#1d4ed8]',
      error: 'bg-destructive/30 border border-destructive/80 text-[#b91c1c]',
    },
  },
})

export interface MessageProps extends VariantProps<typeof messageVariants> {
  children: ReactNode
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ children, variant }, ref) => {
    return (
      <div ref={ref} className={cn(messageVariants({ variant }))}>
        {children}
      </div>
    )
  },
)
Message.displayName = 'Message'

export default Message
