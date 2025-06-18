const themeOverrides = {
  colors: {
    textColor: '#2D3748',
    subtitleColor: '#718096',
    inactiveColor: '#A0AEC0',
    border: '#E2E8F0',
    background: 'white',
    backgroundAlpha: 'rgba(255,255,255,0)',
    secondaryBackground: '#EDF2F7',
    highlight: '#E2E8F0',
    rsi: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2094f3',
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
  },
  shadows: {
    outline: 0,
  },
  components: {
    UploadStep: {
      baseStyle: {
        heading: {
          fontSize: '3xl',
          color: 'textColor',
          mb: '2rem',
        },
        title: {
          fontSize: '2xl',
          lineHeight: 8,
          fontWeight: 'semibold',
          color: 'textColor',
        },
        subtitle: {
          fontSize: 'md',
          lineHeight: 6,
          color: 'subtitleColor',
          mb: '1rem',
        },
        tableWrapper: {
          mb: '0.5rem',
          position: 'relative',
          h: '72px',
        },
        dropzoneText: {
          size: 'lg',
          lineHeight: 7,
          fontWeight: 'semibold',
          color: 'textColor',
        },
        dropZoneBorder: 'rsi.500',
        dropzoneButton: {
          mt: '1rem',
        },
      },
    },
    SelectSheetStep: {
      baseStyle: {
        heading: {
          color: 'textColor',
          mb: 8,
          fontSize: '3xl',
        },
        radio: {},
        radioLabel: {
          color: 'textColor',
        },
      },
    },
    SelectHeaderStep: {
      baseStyle: {
        heading: {
          color: 'textColor',
          mb: 8,
          fontSize: '3xl',
        },
      },
    },
    MatchColumnsStep: {
      baseStyle: {
        heading: {
          color: 'textColor',
          mb: 8,
          fontSize: '3xl',
        },
        title: {
          color: 'textColor',
          fontSize: '2xl',
          lineHeight: 8,
          fontWeight: 'semibold',
          mb: 4,
        },
        userTable: {
          header: {
            fontSize: 'xs',
            lineHeight: 4,
            fontWeight: 'bold',
            letterSpacing: 'wider',
            color: 'textColor',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            ['&[data-ignored]']: {
              color: 'inactiveColor',
            },
          },
          cell: {
            fontSize: 'sm',
            lineHeight: 5,
            fontWeight: 'medium',
            color: 'textColor',
            px: 6,
            py: 4,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            ['&[data-ignored]']: {
              color: 'inactiveColor',
            },
          },
          ignoreButton: {
            size: 'xs',
            colorScheme: 'gray',
            color: 'textColor',
          },
        },
        selectColumn: {
          text: {
            fontSize: 'sm',
            lineHeight: 5,
            fontWeight: 'normal',
            color: 'inactiveColor',
            px: 4,
          },
          accordionLabel: {
            color: 'blue.600',
            fontSize: 'sm',
            lineHeight: 5,
            pl: 1,
          },
          selectLabel: {
            pt: '0.375rem',
            pb: 2,
            fontSize: 'md',
            lineHeight: 6,
            fontWeight: 'medium',
            color: 'textColor',
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: 'lg',
          bg: 'background',
          fontSize: 'lg',
          color: 'textColor',
        },
        closeModalButton: {},
        backButton: {
          gridColumn: '1',
          gridRow: '1',
          justifySelf: 'start',
        },
        continueButton: {
          gridColumn: '1 / 3',
          gridRow: '1',
          justifySelf: 'center',
        },
      },
      variants: {
        rsi: {
          header: {
            bg: 'secondaryBackground',
            px: '2rem',
            py: '1.5rem',
          },
          body: {
            bg: 'background',
            display: 'flex',
            paddingX: '2rem',
            paddingY: '2rem',
            flexDirection: 'column',
            flex: 1,
            overflow: 'auto',
            height: '100%',
          },
          footer: {
            bg: 'secondaryBackground',
            py: '1.5rem',
            px: '2rem',
            justifyContent: 'center',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr',
            gap: '1rem',
          },
          dialog: {
            outline: 'unset',
            minH: 'calc(var(--chakra-vh) - 4rem)',
            maxW: 'calc(var(--chakra-vw) - 4rem)',
            my: '2rem',
            borderRadius: '3xl',
            overflow: 'hidden',
          },
        },
      },
    },
    Button: {
      defaultProps: {
        colorScheme: 'rsi',
      },
    },
  },
  styles: {
    global: {
      // supporting older browsers but avoiding fill-available CSS as it doesn't work https://github.com/chakra-ui/chakra-ui/blob/073bbcd21a9caa830d71b61d6302f47aaa5c154d/packages/components/css-reset/src/css-reset.tsx#L5
      ':root': {
        '--chakra-vh': '100vh',
        '--chakra-vw': '100vw',
      },
      '@supports (height: 100dvh) and (width: 100dvw) ': {
        ':root': {
          '--chakra-vh': '100dvh',
          '--chakra-vw': '100dvw',
        },
      },
      '.rdg': {
        contain: 'size layout style paint',
        borderRadius: 'lg',
        border: 'none',
        borderTop: '1px solid var(--rdg-border-color)',
        blockSize: '100%',
        flex: '1',

        // we have to use vars here because chakra does not autotransform unknown props
        '--rdg-row-height': '35px',
        '--rdg-color': 'var(--chakra-colors-textColor)',
        '--rdg-background-color': 'var(--chakra-colors-background)',
        '--rdg-header-background-color': 'var(--chakra-colors-background)',
        '--rdg-row-hover-background-color': 'var(--chakra-colors-background)',
        '--rdg-selection-color': 'var(--chakra-colors-blue-400)',
        '--rdg-row-selected-background-color': 'var(--chakra-colors-rsi-50)',
        '--row-selected-hover-background-color': 'var(--chakra-colors-rsi-100)',
        '--rdg-error-cell-background-color': 'var(--chakra-colors-red-50)',
        '--rdg-warning-cell-background-color': 'var(--chakra-colors-orange-50)',
        '--rdg-info-cell-background-color': 'var(--chakra-colors-blue-50)',
        '--rdg-border-color': 'var(--chakra-colors-border)',
        '--rdg-frozen-cell-box-shadow': 'none',
        '--rdg-font-size': 'var(--chakra-fontSizes-sm)',
      },
      '.rdg-header-row .rdg-cell': {
        color: 'textColor',
        fontSize: 'xs',
        lineHeight: 10,
        fontWeight: 'bold',
        letterSpacing: 'wider',
        textTransform: 'uppercase',
        '&:first-of-type': {
          borderTopLeftRadius: 'lg',
        },
        '&:last-child': {
          borderTopRightRadius: 'lg',
        },
      },
      '.rdg-row:last-child .rdg-cell:first-of-type': {
        borderBottomLeftRadius: 'lg',
      },
      '.rdg-row:last-child .rdg-cell:last-child': {
        borderBottomRightRadius: 'lg',
      },
      ".rdg[dir='rtl']": {
        '.rdg-row:last-child .rdg-cell:first-of-type': {
          borderBottomRightRadius: 'lg',
          borderBottomLeftRadius: 'none',
        },
        '.rdg-row:last-child .rdg-cell:last-child': {
          borderBottomLeftRadius: 'lg',
          borderBottomRightRadius: 'none',
        },
      },
      '.rdg-cell': {
        contain: 'size layout style paint',
        borderRight: 'none',
        borderInlineEnd: 'none',
        borderBottom: '1px solid var(--rdg-border-color)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        "&[aria-selected='true']": {
          boxShadow: 'inset 0 0 0 1px var(--rdg-selection-color)',
        },
        '&:first-of-type': {
          boxShadow: 'none',
          borderInlineStart: '1px solid var(--rdg-border-color)',
        },
        '&:last-child': {
          borderInlineEnd: '1px solid var(--rdg-border-color)',
        },
      },
      '.rdg-cell-error': {
        backgroundColor: 'var(--rdg-error-cell-background-color)',
      },
      '.rdg-cell-warning': {
        backgroundColor: 'var(--rdg-warning-cell-background-color)',
      },
      '.rdg-cell-info': {
        backgroundColor: 'var(--rdg-info-cell-background-color)',
      },
      '.rdg-static': {
        cursor: 'pointer',
      },
      '.rdg-static .rdg-header-row': {
        display: 'none',
      },
      '.rdg-static .rdg-cell': {
        '--rdg-selection-color': 'none',
      },
      '.rdg-example .rdg-cell': {
        '--rdg-selection-color': 'none',
        borderBottom: 'none',
      },

      '.rdg-radio': {
        display: 'flex',
        alignItems: 'center',
      },
      '.rdg-checkbox': {
        '--rdg-selection-color': 'none',
        display: 'flex',
        alignItems: 'center',
      },
    },
  },
}

export default themeOverrides
