import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "rounded-md border border-b-4 p-4 flex items-start",
  {
    variants: {
      variant: {
        error: "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-900 text-red-800 dark:text-red-100",
        warning: "border-yellow-400 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
        info: "border-blue-400 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  }
);

const iconVariants = cva("mt-0.5 mr-3 h-5 w-5 flex-shrink-0", {
  variants: {
    variant: {
      error: "text-red-400",
      warning: "text-yellow-400",
      info: "text-blue-400",
    },
  },
  defaultVariants: {
    variant: "error",
  },
});

type BannerProps = {
  title: string;
  subtitle: string;
  variant?: "error" | "warning" | "info";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onDismiss?: () => void;
  className?: string;
} & VariantProps<typeof bannerVariants>;

export const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  icon: Icon,
  variant = "info",
  className,
}) => {
  return (
    <div
      role={variant === "info" ? "status" : "alert"}
      className={cn(bannerVariants({ variant }), className)}
    >
      <Icon className={iconVariants({ variant })} />
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="mt-1 text-sm">{subtitle}</p>
      </div>
    </div>
  );
};

export default Banner;
