import gsap from "gsap";

// Maps scroll progress (0-1) to an opacity that ramps up over [inStart,inEnd]
// and back down over [outStart,outEnd].
export function bandOpacity(
  progress: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) {
  const rampIn = gsap.utils.clamp(0, 1, (progress - inStart) / (inEnd - inStart));
  const rampOut = 1 - gsap.utils.clamp(0, 1, (progress - outStart) / (outEnd - outStart));
  return Math.min(rampIn, rampOut);
}
