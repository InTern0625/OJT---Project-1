'use client';
import { ChevronLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const goBack = async () => {
    window.history.go(-1);
}

export function ButtonBack() {
  return (
    <Button onClick={() => goBack()} variant="secondary" size="icon" className="size-8 text-white">
      <ChevronLeftIcon />
    </Button>
  )
}
