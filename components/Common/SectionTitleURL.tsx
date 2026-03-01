"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import React from "react";

const SectionTitleURL = ({
  title,
  paragraph,
  width = "570px",
  center,
  mb = "100px",
}: {
  title: string;
  paragraph: React.ReactNode;
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
          <h2 className="mb-4 text-2xl font-semibold !leading-tight text-black/90 dark:text-white sm:text-4xl md:text-4xl">
            {title}
          </h2>
          <p className="text-justify text-base !leading-relaxed text-black/70 dark:text-white/90 md:text-lg">
            {paragraph}
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SectionTitleURL;
