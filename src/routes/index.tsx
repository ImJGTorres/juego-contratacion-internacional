import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AvatarEditor } from "@/components/AvatarEditor";
import { Welcome } from "@/components/Welcome";
import { World } from "@/components/World";
import { type Avatar, DEFAULT_AVATAR, loadAvatar, saveAvatar } from "@/lib/avatar";
import { type Station, DEFAULT_STATIONS, loadStations } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Corona × Falabella — Dos países, una alianza" },
      { name: "description", content: "Explora, descubre y construye: el desafío de la alianza Corona × Falabella." },
      { property: "og:title", content: "Corona × Falabella — Dos países, una alianza" },
      { property: "og:description", content: "Explora, descubre y construye: el desafío de la alianza Corona × Falabella." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [screen, setScreen] = useState<"welcome" | "editor" | "world">("welcome");
  const [avatar, setAvatar] = useState<Avatar>(DEFAULT_AVATAR);
  const [stations, setStations] = useState<Station[]>(DEFAULT_STATIONS);
  useEffect(() => { setAvatar(loadAvatar()); setStations(loadStations()); }, []);

  if (screen === "editor") return <AvatarEditor avatar={avatar} onChange={(a) => { setAvatar(a); saveAvatar(a); }} onEnter={() => setScreen("world")} onBack={() => setScreen("welcome")} />;
  if (screen === "world") return <World avatar={avatar} stations={stations} onExit={() => setScreen("editor")} />;
  return <Welcome onStart={() => setScreen("editor")} />;
}
