import { format } from 'date-fns'
import { Data } from 'react-spreadsheet-import/types/types'
import { parseFullName } from 'parse-full-name'

const parseRow = (data: Data<any>) => {
  // Parse full name
  // Split into first and last name
  if (typeof data.full_name === 'string') {
    const name = parseFullName(data.full_name)
    return {
      ...data,
      first_name: name.first,
      last_name: name.last,
      middle_name: name.middle,
      suffix: name.suffix,
    }
  }

  // Parse birth date

  return {
    ...data,
  }
}

export default parseRow
