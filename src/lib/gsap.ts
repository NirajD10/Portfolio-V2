"use client";

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register the plugins every page needs exactly once; components import gsap from here.
// Flip, Observer, InertiaPlugin, CustomEase and DrawSVG are imported and registered by the feature
// that needs them (menu, carousel, case studies) so they stay out of the first-load bundle.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);

export { gsap, useGSAP, ScrollTrigger, SplitText };
