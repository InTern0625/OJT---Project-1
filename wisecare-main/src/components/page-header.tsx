import { ReactNode } from 'react'

const PageHeader = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-card flex w-full flex-col px-6 py-8 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  )
}

const PageTitle = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="text-card-foreground text-3xl font-extrabold">{children}</h1>
  )
}

const PageDescription = ({ children }: { children: ReactNode }) => {
  return <p className="text-muted-foreground text-sm font-medium">{children}</p>
}

export { PageHeader, PageTitle, PageDescription }
