'use client';

import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {Tabs as TabsPrimitive} from 'radix-ui';

import {cn} from '@/lib/utils';

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'group/tabs flex gap-2 data-[orientation=horizontal]:flex-col',
        className,
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'rounded-[14px] bg-card border border-white/10 backdrop-blur-[32px] p-2 text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
  {
    variants: {
      variant: {
        default: 'gap-3',
        line: 'gap-2 bg-transparent border-transparent rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({variant}), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-white/30 px-4 text-[14px] font-medium leading-[1.167] tracking-[-0.5px] text-[#eaf6f3] transition-all whitespace-nowrap focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        'bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] backdrop-blur-[7px] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]',
        'data-[state=active]:border-transparent data-[state=active]:[background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)] data-[state=active]:[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]',
        'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:border-transparent',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export {Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants};
