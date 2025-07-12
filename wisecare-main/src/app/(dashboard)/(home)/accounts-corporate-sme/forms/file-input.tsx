'use client'

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { X, UploadCloud } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import accountsSchema from '../accounts-schema'

const FileInput = ({
  form,
  name,
  label,
  isLoading,
  placeholder = 'Click to upload or drag and drop',
  accept,
  maxFiles,
  maxFileSize, // in bytes
}: {
  form: UseFormReturn<z.infer<typeof accountsSchema>>
  name: keyof z.infer<typeof accountsSchema>
  label: string
  isLoading: boolean
  placeholder?: string
  accept?: string
  maxFiles?: number
  maxFileSize?: number 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const validateFiles = useCallback((newFiles: File[]) => {
    if (maxFileSize) {
      const oversizedFiles = newFiles.filter(file => file.size > maxFileSize);
      if (oversizedFiles.length > 0) {
        form.setError(name, {
          type: 'maxFileSize',
          message: `Some files exceed the maximum size of ${formatFileSize(maxFileSize)}`,
        });
        return false;
      }
    }
    return true;
  }, [form, name, maxFileSize]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (!validateFiles(selectedFiles)) return;
    setPendingFiles(selectedFiles)
  }, [validateFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFiles = Array.from(e.dataTransfer.files);
      
      if (!validateFiles(selectedFiles)) return;
      
      setPendingFiles(selectedFiles)

    }
  }, [validateFiles]);

  useEffect(() => {
    if (pendingFiles.length === 0) return;
    const updated = [...files, ...pendingFiles];
    if (maxFiles && updated.length > maxFiles) {
      form.setError(name, {
        type: 'max',
        message: `Maximum ${maxFiles} files allowed`,
      });
      return;
    }
    form.clearErrors(name);
    setFiles(updated)
    form.setValue(name, updated as any);
    setPendingFiles([])
    
  }, [pendingFiles, files, form, name, maxFiles]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      form.setValue(name, updated as any);
      // Clear error if no files left or if we're under maxFiles limit
      if (updated.length === 0 || (maxFiles && updated.length <= maxFiles)) {
        form.clearErrors(name);
      }
      return updated;
    });
  }, [form, name, maxFiles]);

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
                    disabled={isLoading || (maxFiles ? files.length >= maxFiles : false)}
                  >
                    Select Files
                    <input
                      type="file"
                      multiple
                      disabled={isLoading || (maxFiles ? files.length >= maxFiles : false)}
                      onChange={handleChange}
                      accept={accept}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </Button>
                  {maxFiles && (
                    <p className="text-xs text-muted-foreground">
                      {files.length}/{maxFiles} files
                    </p>
                  )}
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Files</h4>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
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
                          disabled={isLoading}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FileInput;