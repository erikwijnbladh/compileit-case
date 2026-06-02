import { People } from "@/components/ui/icons";

export function EmptyDay() {
  return (
    <div className="flex h-full min-h-30 flex-col items-center justify-center gap-2 px-1 text-center text-faint">
      <People size={18} />
      <span className="text-xs leading-tight">Inga tider</span>
    </div>
  );
}
