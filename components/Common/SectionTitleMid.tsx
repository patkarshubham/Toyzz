"use client";
import { motion, useInView } from "framer-motion";
import React from "react";
import { useRef } from "react";

const SectionTitleMid2 = ({
  title,
  paragraph,
  width = "850px",
  center,
  mb = "60px",
}: {
  title: React.ReactNode;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // Only trigger once
  return (
    <>
      <div
        className={`w-full ${center ? "mx-auto text-center" : ""}`}
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-center text-6xl font-semibold text-black/90 dark:text-white md:text-4xl">
            <span className="text-2xl sm:hidden lg:text-3xl">{title}</span>
            <span className="hidden sm:inline">{title}</span>
          </h2>
          <p className="mb-5 px-5 text-base text-black/70 dark:text-white/90 md:text-lg lg:px-0">
            {paragraph}
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SectionTitleMid2;
