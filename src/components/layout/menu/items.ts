import { careerStart } from "@/content/experience";
import { nav, site } from "@/content/site";
import { tools } from "@/content/tools";
import { projects } from "@/content/work/registry";
import { isTbd } from "@/lib/tbd";

/** Menu items (06 §1). Sub-labels are derived from content so they never drift. */
const sub: Record<string, string> = {
  "/": "6 sections",
  "/work": `${projects.length} projects`,
  "/ai": `${tools.length} daily tools`,
  "/about": `Since ${careerStart.slice(0, 4)}`,
  "/contact": isTbd(site.replyTime) ? "Say hello" : `Replies in ${site.replyTime}`,
};

export const menuItems = nav.map((item) => ({ ...item, sub: `${item.label} → ${sub[item.href]}` }));

export const menuTagline = "Building web, apps & AI — from Pune";
