import { create } from 'zustand';

type PrivacyDialogStore = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const usePrivacyDialogStore = create<PrivacyDialogStore>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
