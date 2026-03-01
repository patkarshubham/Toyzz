"use client";
import { motion, useInView } from "framer-motion";
import React from "react";
import { useRef } from "react";

const SectionTitle2 = ({
  title,
  paragraph,
  width = "570px",
  center,
  mb = "50px",
}: {
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <>
      <div
        className={`w-full ${center ? "mx-auto text-center" : ""}`}
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="mb-4 text-3xl font-semibold !leading-tight text-black/90 dark:text-white sm:text-4xl md:text-[30px]">
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

export default SectionTitle2;
