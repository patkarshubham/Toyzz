"use client";
import Image from "next/image";

const CaseStudyBreadcrumb = ({
  pageName,
  description,
  backgroundImage,
}: {
  pageName: React.ReactNode;
  description: string;
  backgroundImage: string;
}) => {
  return (
    <section className="relative z-10 mt-[90px] overflow-hidden py-16 lg:py-24">
      {/* Background Image using Tailwind CSS */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={backgroundImage}
          alt="Background Image"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm dark:bg-black dark:bg-opacity-70"></div>
      <div className="text-justify-center container relative mx-auto flex flex-col items-start ">
        <div className="px-5 lg:px-10">
          <div className="mx-auto mb-8 max-w-4xl lg:mb-5">
            <a
              href="/case-study/"
              className="mb-1 text-base font-semibold leading-relaxed text-primary"
            >
              Case Study
            </a>
            <h1 className="mb-5 text-3xl font-semibold !leading-tight text-black/90 dark:text-white lg:text-5xl">
              {pageName}
            </h1>
            <p className="text-lg leading-relaxed md:text-xl ">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyBreadcrumb;
