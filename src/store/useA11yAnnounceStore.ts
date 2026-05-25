import { create } from 'zustand';

type A11yAnnounceState = {
  message: string;
  announce: (message: string) => void;
};

export const useA11yAnnounceStore = create<A11yAnnounceState>((set) => ({
  message: '',
  announce: (message) => set({ message }),
}));
