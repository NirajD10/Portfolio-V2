"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";

type MenuContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /** The header trigger — focus returns here when the menu closes. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const MenuContext = createContext<MenuContextValue | null>(null);

/** Open/closed state shared by the header trigger and the overlay. The overlay owns the animation. */
export function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const value = useMemo(() => ({ isOpen, setOpen, triggerRef }), [isOpen]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside <MenuProvider>");
  return ctx;
}
