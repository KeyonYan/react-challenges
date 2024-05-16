'use client'

import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion"
import { useState } from "react";

export default function ScrollViewPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const [progress, setProgress] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", () => setProgress(scrollYProgress.get()*100))

  const data = Array.from(new Array(100).keys())
  return (
    <>    
      <motion.div className="fixed top-0 left-0 right-0 h-5 bg-red-500 origin-[0%]" style={{ scaleX }} />
      <div className="fixed text-center w-full left-0 top-0 h-4">{progress.toFixed(2)}%</div>
      {data.map((item, index) => {
        return (
          <p>{item}</p>
        )
      })}
    </>
  )
}