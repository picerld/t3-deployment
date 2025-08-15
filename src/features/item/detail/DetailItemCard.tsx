export function DetailItemCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3 py-3 last:border-b-0">
      <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />
      <div className="flex-1">
        <p className="text-base font-bold">{label}</p>
        <p className="text-lg font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}
