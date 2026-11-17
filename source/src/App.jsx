import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cursor, Grain, Hud, Nav, Preloader, Progress, Transition } from "./components/Chrome";
import Home from "./components/Home";
import ProjectPage from "./components/Project";
import { ScrollTrigger, startSmoothScroll } from "./lib/motion";
import { useRoute } from "./lib/router";
import { useTilt } from "./lib/tilt";

export default function App() {
  const loaded = useSelector((s) => s.ui.loaded);
  const route = useRoute();
  const [preGone, setPreGone] = useState(false);
  useTilt();

  useEffect(() => {
    if (!loaded) return undefined;
    startSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const gone = setTimeout(() => setPreGone(true), 1200);
    return () => { clearTimeout(gone); window.removeEventListener("load", refresh); };
  }, [loaded]);

  const isProject = route.name === "project";
  return (
    <>
      {!preGone && <Preloader />}
      <Cursor />
      <Progress />
      <Nav route={route} />
      <Hud route={route} />
      <main key={isProject ? route.slug : "home"}>
        {isProject ? <ProjectPage slug={route.slug} /> : <Home />}
      </main>
      <Transition />
      <Grain />
    </>
  );
}
