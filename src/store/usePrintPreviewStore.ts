import { create } from 'zustand';

type PrintPreviewStore = {
  enabled: boolean;
  toggle: () => void;
};

export const usePrintPreviewStore = create<PrintPreviewStore>((set) => ({
  enabled: false,
  toggle: () => set((state) => ({ enabled: !state.enabled })),
}));
