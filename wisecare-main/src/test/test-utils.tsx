import { ComponentType, ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const Wrapper = ({ children }: { children: ReactElement<any> }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

// All the providers you need for tests can go here : Theme, Redux, etc.
const customRender = (
  ui: ReactElement<any>,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: Wrapper as ComponentType, ...options })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }
