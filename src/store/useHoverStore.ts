import { create } from 'zustand';

import type { PersonId } from '@/types/app';

type HoverStore = {
  hoveredPersonId: PersonId | null;
  setHoveredPersonId: (personId: PersonId | null) => void;
};

export const useHoverStore = create<HoverStore>((set) => ({
  hoveredPersonId: null,
  setHoveredPersonId: (personId) => set({ hoveredPersonId: personId }),
}));
