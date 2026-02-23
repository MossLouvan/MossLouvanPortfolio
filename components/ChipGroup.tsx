"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ChipGroup({ chips }: { chips: string[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="chips">
      {chips.map((chip, i) => (
        <motion.span
          key={chip}
          className="chip"
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.92 }}
          transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          {chip}
        </motion.span>
      ))}
    </div>
  );
}