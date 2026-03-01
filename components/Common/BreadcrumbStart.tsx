"use client";
import Image from "next/image";
import Link from "next/link";
import useMedia from "use-media";

const BreadcrumbStart = ({
  pageName,
  description,
  buttonlink,
  buttonname, // Add the buttonname prop
}: {
  pageName: React.ReactNode;
  description: string;
  buttonlink: string;
  buttonname: string; // Define buttonname as a string
}) => {
  const isMobile = useMedia({ maxWidth: 767 });

  return (
    <section className="relative z-10 mb-28 overflow-hidden pt-[180px] lg:mb-[140px] lg:pt-[200px] xl:pt-[200px]">
      <div className="container mx-auto flex flex-col items-start text-start">
        <div className="pl-5 lg:pl-10">
          <div className="mx-auto mb-5 max-w-[870px]">
            <h1 className="mb-5 text-3xl font-semibold !leading-tight text-black/90 dark:text-white lg:text-5xl">
              {pageName}
            </h1>
            <p className="mb-10 text-base leading-relaxed text-black/70 dark:text-white/90 md:text-lg">
              {description}
            </p>
          </div>
        </div>
        <div className="mb-5 pl-5 lg:pl-10">
          <Link
            href={buttonlink}
            title={buttonname}
            className="relative inline-block overflow-hidden rounded-lg bg-primary px-5 py-3 text-base font-semibold text-white shadow-md transition transition-all duration-300 ease-in-out hover:rounded-2xl hover:shadow-lg md:block "
          >
            {buttonname}
          </Link>
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

export default BreadcrumbStart;
