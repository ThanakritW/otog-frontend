import { useTheme } from 'next-themes'
import { forwardRef } from 'react'
import { FaCircle } from 'react-icons/fa'

import { ClientOnly } from './ClientOnly'

import { MoonIcon } from '@src/icons/MoonIcon'
import { SunIcon } from '@src/icons/SunIcon'
import { IconButton, IconButtonProps } from '@src/ui/IconButton'

export const ToggleColorModeButton = forwardRef<
  HTMLButtonElement,
  Omit<IconButtonProps, 'icon'>
>((props, ref) => {
  const { resolvedTheme, setTheme } = useTheme()
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }
  return (
    <ClientOnly
      fallback={
        <IconButton
          rounded="full"
          aria-label="Toggle color mode"
          onClick={toggleColorMode}
          icon={<FaCircle />}
        />
      }
    >
      <IconButton
        rounded="full"
        aria-label="Toggle color mode"
        onClick={toggleColorMode}
        icon={
          resolvedTheme === 'light' ? (
            <MoonIcon className="text-gray-500" />
          ) : (
            <SunIcon />
          )
        }
        {...props}
        ref={ref}
      />
    </ClientOnly>
  )
})
