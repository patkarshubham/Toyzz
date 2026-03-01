"use client";
import React from "react";
import "../../styles/global.css";
import Link from "next/link";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="-mx-4 flex flex-wrap pb-8">
      <div className="w-full px-4">
        <ul className="flex items-center justify-center pb-8 pt-8">
          <li className="mx-1">
            <Link
              href="#"
              title="Previous"
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`text-bold flex h-9 min-w-[36px] items-center justify-center rounded-md border border-gray/50 bg-primary bg-opacity-5 px-4 text-black/70 transition hover:bg-primary/100 hover:text-white dark:border-primary dark:text-white/90 ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}>
              Prev
            </Link>
          </li>
          {renderPageNumbers().map((number) => (
            <li
              key={number}
              className="mx-1">
              <Link
                href={`#${number}`}
                title="Page"
                onClick={() => onPageChange(number)}
                className={`text-bold flex h-9 min-w-[36px] items-center justify-center rounded-md border border-gray/50 bg-primary bg-opacity-5 px-4 text-black/70 transition hover:bg-primary/100 hover:text-white dark:border-primary dark:text-white/90 ${
                  currentPage === number ? "bg-primary text-primary" : ""
                }`}>
                {number}
              </Link>
            </li>
          ))}
          <li className="mx-1">
            <Link
              href="#"
              title="Next"
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={`text-bold flex h-9 min-w-[36px] items-center justify-center rounded-md border border-gray/50 bg-primary bg-opacity-5 px-4 text-black/70 transition hover:bg-primary/100 hover:text-white dark:border-primary dark:text-white/90 ${
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}>
              Next
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
