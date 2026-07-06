import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

interface ColorModeContextType {
  mode: 'light' | 'dark'
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextType | null>(null)

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('themeMode')
    return (saved as 'light' | 'dark') || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [mode]
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: {
                  main: '#6366f1', // Indigo
                  light: '#818cf8',
                  dark: '#4f46e5',
                },
                secondary: {
                  main: '#a855f7', // Purple
                  light: '#c084fc',
                  dark: '#7c3aed',
                },
                background: {
                  default: '#090d16',
                  paper: '#111827',
                },
                text: {
                  primary: '#f9fafb',
                  secondary: '#9ca3af',
                },
                divider: '#1f2937',
              }
            : {
                primary: {
                  main: '#4f46e5',
                  light: '#6366f1',
                  dark: '#3730a3',
                },
                secondary: {
                  main: '#9333ea',
                  light: '#a855f7',
                  dark: '#6b21a8',
                },
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#0f172a',
                  secondary: '#475569',
                },
                divider: '#e2e8f0',
              }),
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          h5: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
          },
          h6: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
          },
          button: {
            fontWeight: 600,
            textTransform: 'none',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 50,
                padding: '10px 24px',
                boxShadow: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                transition: 'all 0.2s ease-in-out',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#22293f' : '#e2e8f0',
                  transition: 'border-color 0.2s',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'dark' ? '#3b476f' : '#cbd5e1',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '2px',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 24,
                border: `1px solid ${mode === 'dark' ? '#1f2937' : '#e2e8f0'}`,
                boxShadow:
                  mode === 'dark'
                    ? '0 10px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.5)'
                    : '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: {
                borderRadius: 24,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 24,
                padding: 12,
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
        },
      }),
    [mode]
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider')
  }
  return context
}
