'use client';
import { ChevronLeftIcon } from "lucide-react"
import { FC, useState} from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams, usePathname} from 'next/navigation'


export const ButtonBack = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  

  const fromPath = searchParams.get('fromPath') ?? '/accounts'
  const fromPage = searchParams.get('fromPage') ?? '0'
  const pageSize = searchParams.get('pageSize') ?? '10'
  
  console.log(fromPath,fromPage,pageSize)
  return (
    <Button onClick={() => {
      router.push(`${fromPath}?fromPage=${fromPage}&pageSize=${pageSize}`)
    }} variant="secondary" size="icon" className="flex justify-center pr-2 items-center w-20 md:max-w-xs hover:bg-sky-400 bg-sky-500 text-white">
      <ChevronLeftIcon  />

      Back
    </Button>
  )
}
