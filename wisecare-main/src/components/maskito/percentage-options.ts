import type { MaskitoOptions } from '@maskito/core'
import {
  maskitoInitialCalibrationPlugin,
  maskitoUpdateElement,
} from '@maskito/core'
import {
  maskitoCaretGuard,
  maskitoEventHandler,
  maskitoNumberOptionsGenerator,
} from '@maskito/kit'

export const postfix = '%'
const { plugins, ...numberOptions } = maskitoNumberOptionsGenerator({
  postfix,
  min: 0,
  max: 100,
  precision: 2,
})

export default {
  ...numberOptions,
  plugins: [
    ...plugins,
    maskitoInitialCalibrationPlugin(),
    // Forbids caret to be placed after postfix
    maskitoCaretGuard((value) => [0, value.length - 1]),
    maskitoEventHandler('blur-sm', (element) => {
      if (element.value === postfix) {
        maskitoUpdateElement(element, `0${postfix}`)
      }
    }),
  ],
} satisfies MaskitoOptions
