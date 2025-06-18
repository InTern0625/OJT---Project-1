import typeSchema from '@/app/(dashboard)/admin/types/type-schema'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { FC, FormEventHandler } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

interface Props {
  handleEdit: FormEventHandler<HTMLFormElement>
  isPending: boolean
  name: string
}

const EditTypeFields: FC<Props> = ({ handleEdit, isPending, name }) => {
  const form = useFormContext<z.infer<typeof typeSchema>>()

  return (
    <form onSubmit={handleEdit}>
      <DialogHeader>
        <DialogTitle className="pt-2 text-left break-all">
          Edit {name} type
        </DialogTitle>
        <DialogDescription className="text-left">
          Edit the type name
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="text-right">Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} className="col-span-3" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <DialogFooter>
        <Button disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Save changes'
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default EditTypeFields
