import { AiTools } from "@/components/sections/home/AiTools";
import { Experience } from "@/components/sections/home/Experience";
import { Hero } from "@/components/sections/home/Hero";
import { Numbers } from "@/components/sections/home/Numbers";
import { Tracks } from "@/components/sections/home/Tracks";
import { WorkReel } from "@/components/sections/home/WorkReel";

/**
 * Home (04): Hero → Tracks → Numbers (pinned) → AI tools → Work reel → Experience → footer CTA.
 * H7 (final CTA) is the footer's "Got a product in mind?" block on every page.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Tracks />
      <Numbers />
      <AiTools />
      <WorkReel />
      <Experience />
    </>
  );
}
