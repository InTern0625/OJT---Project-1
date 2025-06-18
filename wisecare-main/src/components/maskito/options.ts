import { maskitoDateOptionsGenerator } from '@maskito/kit'

const dateOptions = maskitoDateOptionsGenerator({
  mode: 'yyyy/mm/dd',
  separator: '-',
})

export { dateOptions }
