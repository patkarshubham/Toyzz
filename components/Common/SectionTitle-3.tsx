"use client";
import { motion } from "framer-motion";
import React from "react";

const SectionTitle3 = ({
  title,
  paragraph,
  width = "600px",
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
          <h2 className="mb-4 mt-5 text-2xl font-semibold !leading-tight text-black/90 dark:text-white lg:text-4xl">
            {title}
          </h2>
          <p className="text-base !leading-relaxed text-black/70 dark:text-white/90 md:text-lg">
            {paragraph}
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SectionTitle3;
