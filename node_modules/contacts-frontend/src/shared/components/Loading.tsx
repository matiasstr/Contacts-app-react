type LoadingProps = {
  label?: string;
};

export default function Loading({ label = 'Loading...' }: LoadingProps) {
  return (
    <div className="flex min-h-28 items-center justify-center rounded-md border border-dashed border-line bg-white text-sm font-medium text-muted">
      {label}
    </div>
  );
}
