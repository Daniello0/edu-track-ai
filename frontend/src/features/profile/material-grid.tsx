import type { LibraryItem } from './profile.types';
import { MaterialCard } from './material-card';

interface MaterialGridProps {
  items: LibraryItem[];
  continuingMaterialId: string | null;
  onContinue: (materialId: string) => void;
}

/**
 * Grid of saved library materials on the profile page.
 */
export function MaterialGrid({
  items,
  continuingMaterialId,
  onContinue,
}: MaterialGridProps) {
  return (
    <ul className="profile-material-grid">
      {items.map((item) => (
        <MaterialCard
          key={item.id}
          item={item}
          isContinuing={continuingMaterialId === item.id}
          onContinue={onContinue}
        />
      ))}
    </ul>
  );
}
