import { format, isValid } from 'date-fns'
import { RawData } from 'react-spreadsheet-import/types/types'

const parseDate = (data: RawData[]): Promise<RawData[]> => {
  return new Promise((resolve) => {
    const formattedData = data.map((row) => {
      return row.map((cell) => {
        if (typeof cell === 'string' && isValid(cell)) {
          return format(new Date(cell), 'MM/dd/yyyy')
        }
        return cell
      })
    })

    resolve(formattedData)
  })
}

export default parseDate
