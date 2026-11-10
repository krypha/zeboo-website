import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-heading font-semibold leading-normal whitespace-nowrap transition-[transform,filter] duration-100 ease-in-out hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:brightness-[1.08]',
        amber: 'bg-accent text-accent-foreground',
        outline: 'border-[1.6px] border-primary bg-transparent text-primary',
        ghost: 'bg-secondary text-secondary-foreground',
        // laterite means deletion in the charter, and a soft ground with laterite ink reads in both modes where a filled one would not, the dark palette lightening the clay itself
        danger: 'bg-destructive-soft text-destructive-ink',
      },
      // a square size carries no padding of its own, its side being the whole target
      size: {
        sm: 'px-3.5 py-2 text-[13px]',
        default: 'px-5 py-[11px] text-[14.5px]',
        lg: 'px-6 py-3.5 text-base',
        icon: 'size-11 p-0',
        'icon-sm': 'size-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'primary',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
