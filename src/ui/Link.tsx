import { VariantProps, cva } from 'class-variance-authority'
import { ComponentProps, PropsWithChildren, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const linkStyles = cva(
  'cursor-pointer hover:underline focus-visible:underline',
  {
    variants: {
      variant: {
        default: 'text-otog',
        hidden: 'hover:text-otog',
        nav: 'text-gray-500 dark:text-gray-400 hover:text-gray-800 hover:dark:text-white active:text-gray-800 dark:active:text-white transition-colors',
        close:
          'text-gray-300 dark:text-alpha-white-400 hover:text-otog hover:dark:text-otog',
        head: 'hover:text-gray-900 hover:dark:text-gray-100 hover:no-underline transition-colors',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type LinkProps = PropsWithChildren<
  VariantProps<typeof linkStyles> &
    ComponentProps<'a'> & {
      isExternal?: boolean
      isActive?: boolean
    }
>

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      children,
      href,
      variant,
      isActive = false,
      isExternal = false,
      ...props
    },
    ref
  ) => {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        className={twMerge(linkStyles({ variant }), className)}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener' : undefined}
        data-active={isActive}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    )
  }
)
