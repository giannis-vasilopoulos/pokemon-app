import { create } from 'zustand';

import { MAX_TEAM_SLOTS } from '@/lib/constants';

type TeamStore = {
  slots: string[];
  add: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
  setSlots: (slots: string[]) => void;
};

export const useTeamStore = create<TeamStore>((set) => ({
  slots: [],
  add: (name) =>
    set((state) => {
      if (state.slots.includes(name)) return state;
      if (state.slots.length >= MAX_TEAM_SLOTS) return state;
      return { slots: [...state.slots, name] };
    }),
  remove: (name) =>
    set((state) => ({ slots: state.slots.filter((slot) => slot !== name) })),
  clear: () => set({ slots: [] }),
  setSlots: (slots) => set({ slots: slots.slice(0, MAX_TEAM_SLOTS) }),
}));
