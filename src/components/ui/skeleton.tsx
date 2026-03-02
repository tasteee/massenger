import { cn } from "@/lib/utils"

const Skeleton = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-[var(--radius-lg)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
