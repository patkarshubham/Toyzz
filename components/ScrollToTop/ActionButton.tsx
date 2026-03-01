import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiCalendar, BiPhone } from "react-icons/bi";
import Link from "next/link";
import { ImCross } from "react-icons/im";
import { MdAddReaction } from "react-icons/md";

const ExpandableActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMainButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleScheduleClick = () => {
    setIsOpen(false);
  };

  const handleTalkToSalesClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[99]">
      <span className="relative flex h-12 w-12 rounded-full">
        {/* Outer div with ping animation */}
        <span className="absolute h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
        {/* Inner button container */}
        <span className="relative z-10 h-12 w-12 rounded-full bg-primary">
          <div>
            <button
              onClick={handleMainButtonClick}
              className="z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors duration-200 hover:bg-opacity-90"
            >
              {isOpen ? <ImCross size={20} /> : <MdAddReaction size={25} />}
            </button>
          </div>
        </span>
      </span>
      {/* Expandable Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-0 flex min-w-[170px] flex-col gap-3"
          >
            {/* Schedule Demo Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.1 }}
              onClick={handleScheduleClick}
              className="flex items-center gap-3 rounded-lg border border-dotted border-primary bg-white px-3 py-3 text-current shadow-md duration-200 hover:text-primary dark:bg-black"
            >
              <BiCalendar size={20} className="text-primary" />
              <Link href="/demo/" title="Demo">
                <span className="font-medium">Demo</span>
              </Link>
            </motion.button>
            {/* Talk to Sales Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.3 }}
              onClick={handleTalkToSalesClick}
              className="flex items-center gap-3 rounded-lg border border-dotted border-primary bg-white px-3 py-3 text-current shadow-md duration-200 hover:text-primary dark:bg-black"
            >
              <BiPhone size={20} className="text-primary" />
              <Link href="/contact/" title="Talk to Sales">
                <span className="font-medium">Talk to Sales</span>
              </Link>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableActionButton;
