import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-0 right-6 z-[99]">
      {isVisible && (
        <div
          onClick={scrollToTop}
          aria-label="Scroll to Top"
          className="flex h-10 w-10 cursor-pointer items-center justify-center bg-primary font-bold text-white shadow-md transition-transform duration-300 ease-in-out hover:bg-opacity-80"
        >
          <FaChevronUp size={20} className="animate-bounce" />
          {/* <span className="mt-[6px] text-bold h-3 w-3 rotate-45 border-t border-l border-white"></span> */}
        </div>
      )}
    </div>
  );
}
