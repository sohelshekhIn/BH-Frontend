import { mapIUCNToScale, getIUCNColor } from "@/lib/iucn-utils";

interface IUCNBatteryIndicatorProps {
  category: string;
}

/**
 * Battery-style indicator for IUCN protection level
 * Shows 7 boxes representing protection strictness scale
 */
export function IUCNBatteryIndicator({ category }: IUCNBatteryIndicatorProps) {
  const level = mapIUCNToScale(category);
  const color = getIUCNColor(level);
  const totalBoxes = 7;

  // Don't render if level is 0 (unmapped category)
  if (level === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex gap-0.5">
        {Array.from({ length: totalBoxes }).map((_, idx) => (
          <div
            key={idx}
            className="w-2 h-3 border border-gray-300 rounded-[1px]"
            style={{
              backgroundColor: idx < level ? color : 'transparent',
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-1">
        {level}/7
      </span>
    </div>
  );
}

