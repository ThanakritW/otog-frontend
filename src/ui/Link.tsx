import { VariantProps, cva } from 'cva'
import { AnchorHTMLAttributes, PropsWithChildren } from 'react'

const linkStyles = cva(
  'cursor-pointer hover:underline focus-visible:underline',
  {
    variants: {
      variant: {
        default: 'text-otog',
        hidden: 'hover:text-otog',
        nav:
          'text-gray-500 dark:text-gray-400 hover:text-gray-800 hover:dark:text-white active:text-gray-800 dark:active:text-white transition-colors',
        close:
          'text-gray-300 dark:text-alpha-400 hover:text-otog hover:dark:text-otog',
        head:
          'hover:text-gray-900 hover:dark:text-gray-100 hover:no-underline transition-colors',
      },
      isActive: { true: 'active' },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type LinkProps = PropsWithChildren<
  VariantProps<typeof linkStyles> &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
      isExternal?: boolean
    }
>
export const Link = ({
  className,
  children,
  href,
  variant,
  isActive,
  isExternal = false,
  ...props
}: LinkProps) => {
  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      className={linkStyles({ variant, className, isActive })}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}
