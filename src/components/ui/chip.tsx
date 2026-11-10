import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const chipVariants = cva(
  'inline-flex w-fit cursor-pointer items-center justify-center rounded-full border px-[13px] py-[7px] font-sans text-[13px] font-medium leading-normal transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-secondary text-secondary-foreground',
        on: 'border-primary bg-primary-soft font-semibold text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Chip({
  className,
  variant,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof chipVariants>) {
  return (
    <button
      type="button"
      data-slot="chip"
      data-variant={variant}
      className={cn(chipVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Chip, chipVariants };
