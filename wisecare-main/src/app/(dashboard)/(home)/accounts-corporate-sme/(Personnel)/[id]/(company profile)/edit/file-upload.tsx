'use client'

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { X, UploadCloud, File } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { createBrowserClient } from '@/utils/supabase-client'
import { Loader2 } from 'lucide-react'

interface FileInputProps {
  form: UseFormReturn<any>
  name: string
  label: string
  placeholder?: string
  maxFiles?: number
  maxFileSize?: number
  accept?: string
  existingFiles?: string[]
  id?: string
}

const FileInput = ({
  form,
  name,
  label,
  placeholder = 'Click to upload or drag and drop',
  maxFiles,
  maxFileSize = 25 * 1024 * 1024,
  accept,
  existingFiles = [],
  id
}: FileInputProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [existingFileUrls, setExistingFileUrls] = useState<string[]>([])
  const [errorOccurred, setErrorOccurred] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [isLoadingFiles, setLoadingFiles] = useState(false)
  const supabase = createBrowserClient()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted || errorOccurred || existingFiles.length === 0) return

    const getSignedUrls = async () => {
      setLoadingFiles(true)
      const signedUrls = await Promise.all(
        existingFiles.map(async (filePath) => {
          const { data, error } = await supabase.storage
            .from('accounts')
            .createSignedUrl(filePath.trim(), 3600)
          if (error) {
            console.error('Error creating signed URL:', error)
            setTimeout(() => setErrorOccurred(true), 0)
            return null
          }
          return data?.signedUrl
        })
      )
      setExistingFileUrls(signedUrls.filter((url) => url !== null) as string[])
      setLoadingFiles(false)
    }

    getSignedUrls()
  }, [hasMounted, existingFiles, supabase, errorOccurred])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const validateFiles = useCallback((newFiles: File[]) => {
    if (maxFileSize) {
      const oversizedFiles = newFiles.filter(file => file.size > maxFileSize)
      if (oversizedFiles.length > 0) {
        form.setError(name, {
          type: 'maxFileSize',
          message: `Some files exceed the maximum size of ${formatFileSize(maxFileSize)}`,
        })
        return false
      }
    }
    return true
  }, [form, name, maxFileSize])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (!validateFiles(selectedFiles)) return

    let updated = [...files, ...selectedFiles]
    if (maxFiles && updated.length > maxFiles) {
      form.setError(name, {
        type: 'max',
        message: `Maximum ${maxFiles} files allowed`,
      })
      updated = updated.slice(0, maxFiles)
    } else {
      form.clearErrors(name)
    }

    setFiles(updated)
    form.setValue(name, updated)

    e.target.value = ''
  }, [files, form, name, maxFiles, validateFiles])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const selectedFiles = Array.from(e.dataTransfer.files || [])
    if (!validateFiles(selectedFiles)) return

    let updated = [...files, ...selectedFiles]
    if (maxFiles && updated.length > maxFiles) {
      form.setError(name, {
        type: 'max',
        message: `Maximum ${maxFiles} files allowed`,
      })
      updated = updated.slice(0, maxFiles)
    } else {
      form.clearErrors(name)
    }

    setFiles(updated)
    form.setValue(name, updated)
  }, [files, form, name, maxFiles, validateFiles])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleRemove = useCallback((index: number) => {
    const updated = [...files]
    updated.splice(index, 1)
    setFiles(updated)
    form.setValue(name, updated)

    if (updated.length === 0 || (maxFiles && updated.length <= maxFiles)) {
      form.clearErrors(name)
    }
  }, [files, form, name, maxFiles])

  const handleRemoveExisting = useCallback(async (index: number, filePath: string) => {
    const updatedFiles = [...existingFiles]
    updatedFiles.splice(index, 1)
    form.setValue(name, updatedFiles)

    const { error } = await supabase.storage.from('accounts').remove([filePath])
    if (error) {
      console.error('Error deleting file:', error)
      return
    }

    const updatedUrls = [...existingFileUrls]
    updatedUrls.splice(index, 1)
    setExistingFileUrls(updatedUrls)
  }, [form, name, existingFiles, existingFileUrls, supabase])

  const extractFileName = (url: string) => {
    const match = url.match(/-([^-\/?]+)(\?.*)?$/)
    return match ? match[1] : 'Unknown'
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted-foreground/30 hover:border-muted-foreground/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{placeholder}</p>
                  {maxFileSize && (
                    <p className="text-xs text-muted-foreground">
                      Max file size: {formatFileSize(maxFileSize)}
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={maxFiles ? (files.length + existingFileUrls.length) >= maxFiles : false}
                  >
                    Select Files
                    <input
                      type="file"
                      multiple
                      disabled={maxFiles ? (files.length + existingFileUrls.length) >= maxFiles : false}
                      onChange={handleChange}
                      accept={accept}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </Button>
                  {maxFiles && (
                    <p className="text-xs text-muted-foreground">
                      {files.length + existingFileUrls.length}/{maxFiles} files
                    </p>
                  )}
                </div>
              </div>
              {isLoadingFiles ? <Loader2 className="animate-spin" /> :
                ((files.length > 0 || existingFileUrls.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Selected Files</h4>
                    <div className="space-y-2">
                      {existingFileUrls.map((url, index) => (
                        <div
                          key={`existing-${index}`}
                          className="flex items-center justify-between gap-2 rounded border p-3 text-sm"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="truncate font-medium hover:underline"
                            >
                              {extractFileName(url)}
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveExisting(index, existingFiles[index])}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      {files.map((file, index) => (
                        <div
                          key={`new-${file.name}-${index}`}
                          className={`flex items-center justify-between gap-2 rounded border p-3 text-sm ${
                            maxFileSize && file.size > maxFileSize ? 'border-destructive' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate font-medium">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                            {maxFileSize && file.size > maxFileSize && (
                              <span className="text-xs text-destructive">
                                (Exceeds limit)
                              </span>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleRemove(index)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FileInput
