import { cn } from "@/components/shadcn/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-900/10 dark:bg-zinc-50/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
