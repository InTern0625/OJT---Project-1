import { Button } from '@/components/ui/button'
import { cn } from '@/utils/tailwind'
import {
  ActivitySquare,
  CalendarClock,
  CreditCard,
  UserCircle,
  Users,
  X,
  //Hospital,
  BookCopy,
  Plus,
} from 'lucide-react'
import { ComponentType, FC } from 'react'
import { useTypesContext } from './type-card'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createBrowserClient } from "@/utils/supabase-client"
import { useState, useEffect, useCallback, FormEventHandler } from "react"

interface NavigationLink {
  name: string
  description: string
  tab: string
  icon: ComponentType<{ className?: string }>
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  account_types: UserCircle,
  hmo_providers: ActivitySquare,
  mode_of_payments: CreditCard,
  plan_types: Users,
  room_plans: X,
  program_types: BookCopy,
}

const NavigationItem: FC<NavigationLink> = ({
  name,
  description,
  tab,
  icon: Icon,
}) => {
  const { page, setPage, setIsNavOpen } = useTypesContext()

  const handleClick = () => {
    setPage(tab)
    setIsNavOpen(false)
  }
  return (
    <button
      className={cn(
        page === tab ? 'bg-primary/10' : 'hover:bg-muted',
        'flex max-h-28 w-full cursor-pointer flex-row items-start justify-start gap-3 px-8 py-5 sm:w-96',
      )}
      onClick={handleClick}
    >
      <Icon
        className={cn(
          page === tab ? 'text-primary' : 'text-foreground/80',
          'h-6 w-6',
        )}
      />
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            page === tab ? 'text-primary' : 'text-foreground/80',
            'text-left text-sm font-medium',
          )}
        >
          {name}
        </span>
        <span className="text-muted-foreground/70 text-sm">{description}</span>
      </div>
    </button>
  )
}

interface Props {
  open: boolean
}

const TypesNavigation: FC<Props> = ({ open }) => {
  const supabase = createBrowserClient()
  const [openForm, setOpenForm] = useState(false)
  const [navigationLinks, setNavigationLinks] = useState<NavigationLink[]>([])

  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase.from('type_registry').select('name')
      console.log(data)
      if (error) {
        console.log('Failed to fetch types:', error)
        return
      }

      const dynamicLinks: NavigationLink[] = data.map((item) => {
      
        const tab = item.name
        const name = tab.replace(/_/g, ' ').replace(/\b\w/g, (c:string) => c.toUpperCase())
        const description = `Manage ${name}`
        const icon = iconMap[tab] || UserCircle
        console.log('success')
        return { name, description, tab, icon }
    })

      setNavigationLinks(dynamicLinks)
    }

    fetchTypes()
  }, [])
  
  const { setIsNavOpen } = useTypesContext()

  const addtypeSchema = z.object({
    title: z.string().min(2,
        {message: "Title must be more than 2 characters"}
    ).max(30,{
        message: "Title must be less than 30 characters"
    }) || z.null(),
  })
    
  const form = useForm<z.infer<typeof addtypeSchema>>({
    resolver: zodResolver(addtypeSchema),
    defaultValues: {
        title: "",
    },
  })
  
  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      form.handleSubmit(async (data) => {
      console.log(data)
      const name = `${data.title}`.toLowerCase().replace(/\s+/g, '_')
      const { error } = await supabase.from('type_registry').insert([
        {
          name,
        },
      ])

      if (error) {
        console.error('Insert failed:', error)
      } else {
        console.log(`Inserted into type_registry:`, name)
        form.reset()
      }
    toast({
    title: `Type: ${name}`,
    description: 'Created successfully!',
    variant: 'default', 
    })
    setOpenForm(false)
    })(e)
  },
  [form]
)

  return (
    <>
      <div
        data-open={open}
        className="border-border absolute -left-[600px] z-20 h-[calc(100vh-64px)] w-full border-r bg-white transition-all duration-1000 data-[open=true]:left-0 sm:-left-96 sm:w-96 md:-left-24 md:-z-10 md:data-[open=true]:left-72 md:data-[open=true]:z-20 lg:relative lg:left-0 lg:z-20 lg:transition-none"
      >
        <div className="flex flex-row items-center justify-between px-8 py-9">
          <h2 className="text-3xl font-extrabold">Manage Types</h2>
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button variant={'ghost'} size={'icon'} className="Plus">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-1xl">
              <DialogHeader>
                <DialogTitle className="mb-3">Add Type</DialogTitle>
              </DialogHeader>
              <Form {...form}>
              <form className="grid grid-cols-1 items-center justify-items-center gap-6" onSubmit={onSubmit}>
                <FormField 
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 w-full flex-column col-span-1 gap-6 items-center">
                      <Label className="col-span-1">Enter Title</Label>
                      <Input
                        className="col-span-3"
                        id="link"
                        placeholder="Title"
                        {...field}
                      />
                    </FormItem>
                  )}
                />  
                <Button type="submit" className="col-span-1 w-60">Create Type</Button>
              </form>
            </Form>
          </DialogContent>
          </Dialog>
        </div>
        <div className="divide-border border-border divide-y border-y">
          {navigationLinks.map((link) => (
            <NavigationItem {...link} key={link.tab} />
          ))}
          {navigationLinks.length === 0  && <div>Loading Types</div>}
        </div>
      </div>
      <div
        data-open={open}
        className="absolute z-10 hidden h-screen w-screen bg-black/50 transition-all duration-1000 data-[open=true]:block md:hidden"
        onClick={() => setIsNavOpen(false)}
      />
    </>
  )
}

export default TypesNavigation
