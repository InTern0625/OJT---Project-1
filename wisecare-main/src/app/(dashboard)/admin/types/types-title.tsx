import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { FC } from 'react'
//import { TypeTabs } from './type-card'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface Props {
  page: string
  handleClick: () => void
}

const TypesTitle: FC<Props> = ({ page, handleClick }) => {
  const supabase = createBrowserClient()

  const renderTitle = () => {
    if (!page) return ''
    
    return page
      .replace(/_/g, ' ') 
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <div className="flex flex-row items-center gap-1 px-3 lg:px-12">
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={handleClick}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">{renderTitle()}</h1>
    </div>
  )
}

export default TypesTitle
