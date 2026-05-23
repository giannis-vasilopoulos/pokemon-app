import { create } from 'zustand';

const MAX_COMPARE_SLOTS = 4;

type CompareStore = {
  slots: string[];
  add: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
};

export const useCompareStore = create<CompareStore>((set) => ({
  slots: [],
  add: (name) =>
    set((state) => {
      if (state.slots.includes(name)) return state;
      if (state.slots.length >= MAX_COMPARE_SLOTS) return state;
      return { slots: [...state.slots, name] };
    }),
  remove: (name) =>
    set((state) => ({ slots: state.slots.filter((slot) => slot !== name) })),
  clear: () => set({ slots: [] }),
}));
