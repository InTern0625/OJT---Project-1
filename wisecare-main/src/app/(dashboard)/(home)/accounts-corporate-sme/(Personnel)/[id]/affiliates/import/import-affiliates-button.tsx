import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ImportAffiliates = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/import/import-affiliate'
    ),
  { ssr: false },
)

const ImportAffiliateButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Import</Button>
      {isOpen && <ImportAffiliates isOpen={isOpen} setIsOpen={setIsOpen} />}
    </>
  )
}

export default ImportAffiliateButton
