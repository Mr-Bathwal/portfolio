import { configureStore, createSlice } from "@reduxjs/toolkit";

const savedTheme = (() => {
  try { return localStorage.getItem("gb-theme"); } catch { return null; }
})();

const ui = createSlice({
  name: "ui",
  initialState: {
    theme: savedTheme === "light" ? "light" : "dark",
    loaded: false,
    menuOpen: false,
    activeSection: "top",
    labStage: 0,
  },
  reducers: {
    toggleTheme(state) { state.theme = state.theme === "dark" ? "light" : "dark"; },
    setLoaded(state) { state.loaded = true; },
    setMenu(state, action) { state.menuOpen = action.payload; },
    setActiveSection(state, action) { state.activeSection = action.payload; },
    setLabStage(state, action) { state.labStage = action.payload; },
  },
});

const work = createSlice({
  name: "work",
  initialState: { filter: "all" },
  reducers: { setFilter(state, action) { state.filter = action.payload; } },
});

export const { toggleTheme, setLoaded, setMenu, setActiveSection, setLabStage } = ui.actions;
export const { setFilter } = work.actions;

export const store = configureStore({ reducer: { ui: ui.reducer, work: work.reducer } });

store.subscribe(() => {
  const { theme } = store.getState().ui;
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("gb-theme", theme); } catch { /* storage blocked */ }
});
document.documentElement.dataset.theme = store.getState().ui.theme;
