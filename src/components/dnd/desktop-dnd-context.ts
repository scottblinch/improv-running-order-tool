import { createContext, useContext } from 'react';

const DesktopDndContext = createContext(false);

export const DesktopDndProvider = DesktopDndContext.Provider;

export function useDesktopDndEnabled(): boolean {
  return useContext(DesktopDndContext);
}
