"use client";
import Image from "next/image";
import useMedia from "use-media";
import { motion } from "framer-motion";

const BreadcrumbTitle = ({
  textunique,
  pageName,
  description,
}: {
  textunique: string;
  pageName: React.ReactNode;
  description: string;
}) => {
  const isMobile = useMedia({ maxWidth: 767 });
  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pt-[150px] xl:pt-[160px] 2xl:pt-[180px]">
      <div className="container mx-auto flex flex-col items-center justify-center text-center">
        <div className="mb-28 w-full px-4 lg:mb-[140px]">
          <div className="mx-auto mb-5 max-w-[1000px]">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              <div className="px-5 lg:px-10">
                <div className="mx-auto mb-8 max-w-4xl lg:mb-5">
                  <p className="mb-4 text-base font-medium leading-relaxed text-black/60 dark:text-white/90 lg:mb-8 lg:text-xl">
                    {textunique}
                  </p>
                  <h1 className="mb-5 text-3xl font-semibold !leading-tight text-black/90 dark:text-white lg:text-5xl">
                    {pageName}
                  </h1>
                  <p className="text-lg leading-relaxed md:text-xl ">
                    {description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-0 z-[-1] opacity-30 lg:opacity-100">
        <svg
          width="450"
          height="556"
          fill="none"
          viewBox="0 0 350 756"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="18" cy="182" r="18" fill="url(#b)">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 12; 0 0"
              begin="0.4s"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="77" cy="288" r="34" fill="url(#a)">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 8; 0 0"
              begin="0.4s"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="18" cy="182" r="18" fill="url(#b)">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 12; 0 0"
              begin="0.4s"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="77" cy="288" r="34" fill="url(#a)">
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="translate"
              values="0 0; 0 8; 0 0"
              begin="0.4s"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <defs>
            <radialGradient
              id="b"
              cx="0"
              cy="0"
              r="1"
              gradientTransform="translate(18 182) rotate(90) scale(18)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".14583" stopColor="#4a6cf7" stopOpacity="0" />
              <stop offset="1" stopColor="#4a6cf7" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient
              id="a"
              cx="0"
              cy="0"
              r="1"
              gradientTransform="translate(77 288) rotate(90) scale(34)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".14583" stopColor="#4a6cf7" stopOpacity="0" />
              <stop offset="1" stopColor="#4a6cf7" stopOpacity="0.08" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute right-0 top-0 z-[-1]">
        <Image
          src={
            isMobile ? "/images/hero/shape-01.svg" : "/images/hero/shape-01.svg"
          }
          alt="hero"
          width={isMobile ? 200 : 280}
          height={isMobile ? 190 : 556}
          className="fill-current"
        />
      </div>
    </section>
  );
};

export default BreadcrumbTitle;
