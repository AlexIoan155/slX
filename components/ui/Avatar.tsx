import clsx from "clsx";

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

export function Avatar({
  name,
  email,
  avatarUrl,
  size = "md",
  className,
}: {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- external, user-supplied URLs; next/image would require configuring every possible remote host.
    return (
      <img
        src={avatarUrl}
        alt={name ?? "Avatar"}
        className={clsx("shrink-0 rounded-full object-cover ring-1 ring-surface-border", SIZE_CLASSES[size], className)}
      />
    );
  }

  return (
    <span
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-alert-from to-alert-to font-display font-semibold text-black",
        SIZE_CLASSES[size],
        className
      )}
      aria-hidden
    >
      {getInitials(name, email)}
    </span>
  );
}
