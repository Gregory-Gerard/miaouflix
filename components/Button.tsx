'use client';

import { useRender } from '@base-ui/react/use-render';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-8 py-2 font-bold shadow-sm transition-all hover:shadow-xl focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:outline-0 disabled:cursor-wait disabled:opacity-60 has-[svg]:pl-6',
  {
    variants: {
      variant: {
        primary: 'bg-neutral-200 text-neutral-950 hover:bg-neutral-300',
        accent: 'bg-red-600 text-white hover:bg-red-500',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

type ButtonProps = useRender.ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export default function Button({ render, variant, className, ...props }: ButtonProps) {
  return useRender({
    defaultTagName: 'button',
    render,
    props: { ...props, className: cn(buttonVariants({ variant }), className) },
  });
}
