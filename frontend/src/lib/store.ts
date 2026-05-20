import { create } from "zustand";

type AnimationState =
  | "idle"
  | "transitioning-to-projects"
  | "portal-entry";

interface Store {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  animationState: AnimationState;
  setAnimationState: (state: AnimationState) => void;
}

export const useStore = create<Store>((set) => ({
  currentRoute: "/",
  setCurrentRoute: (route) => set({ currentRoute: route }),
  animationState: "idle",
  setAnimationState: (state) => set({ animationState: state }),
}));
