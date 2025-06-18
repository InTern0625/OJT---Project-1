interface Props {
  title: string
  description?: string
}

const PageTitle = ({ title, description }: Props) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground/75 text-sm font-medium">
          {description}
        </p>
      )}
    </div>
  )
}

export default PageTitle
