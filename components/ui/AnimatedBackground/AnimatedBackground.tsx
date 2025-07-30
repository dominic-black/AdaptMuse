"use client";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
      id="background-lololol"
    >
      <motion.div
        className="-top-32 -right-32 absolute opacity-90 blur-xl rounded-full w-[520px] h-[520px]"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, #e1bee7 0%, #ce93d8 50%, #ba68c8 70%, transparent 100%)",
        }}
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="bottom-0 left-0 absolute opacity-80 blur-lg rounded-full w-[380px] h-[380px]"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, #f8bbd0 0%, #f48fb1 40%, #e91e63 70%, transparent 100%)",
        }}
        animate={{ scale: [1.09, 1, 1.09] }}
        transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
      />
      <motion.div
        className="top-[58%] left-1/2 absolute opacity-70 blur-lg rounded-full w-[600px] h-[120px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, #ce93d8 10%, #f8bbd0 50%, #e1bee7 100%)",
        }}
        animate={{ x: [0, 40, -40, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />
      {/* Additional central glow for more visibility */}
      <motion.div
        className="top-1/2 left-1/2 absolute opacity-60 blur-2xl rounded-full w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, #e1bee7 0%, #ce93d8 30%, transparent 70%)",
        }}
        animate={{ scale: [0.8, 1.1, 0.8], rotate: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />
    </div>
  );
}
