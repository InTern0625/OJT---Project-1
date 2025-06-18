import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-center text-4xl font-extrabold">Ooops... 404!</h1>
      <h3 className="text-muted-foreground text-center text-base font-medium">
        The page you requested could not be found.
      </h3>
      <Button>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  )
}

export default NotFound
