type FileInformationProps = {
  urls: string[] 
  label: string
}

const FileInformation = ({ urls, label }: FileInformationProps) => {
  const extractFileName = (url: string) => {
    const match = url.match(/-([^-\/?]+)(\?.*)?$/)
    return match ? match[1] : 'Unknown'
  }

  const hasFiles = urls.length > 0
  return (
    <div className="flex flex-col py-1 space-y-2">
      <div className="text-muted-foreground text-sm font-medium">{label}</div>

      {hasFiles ? (
        urls.map((fileUrl, index) => (
          <div
            key={index}
            className="text-md font-semibold text-pretty break-words"
          >
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">{extractFileName(fileUrl)} {label}</a>
          </div>
        ))
      ) : (
        <div className="text-md font-semibold text-pretty break-words">No Files</div>
      )}
    </div>
  )
}
export default FileInformation