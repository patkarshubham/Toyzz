"use client";
import { motion } from "framer-motion";
import React from "react";

const SectionTitle = ({
  title,
  paragraph,
  width = "570px",
  center,
  mb = "60px",
}: {
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  return (
    <>
      <div
        className={`w-full ${center ? "mx-auto text-center" : ""}`}
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="mb-4 text-3xl font-semibold !leading-tight text-black/90 dark:text-white sm:text-4xl md:text-4xl">
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

export default SectionTitle;
