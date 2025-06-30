import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ImportEmployees = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/employees/import/import-employees'
    ),
  { ssr: false },
)

const ImportEmployeesButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Import</Button>
      {isOpen && <ImportEmployees isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  )
}

export default ImportEmployeesButton
