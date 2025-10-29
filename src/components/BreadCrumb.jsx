import React from "react";
import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";

const Breadcrumb = ({ items = [], className = "" }) => {
  return (
    <nav className={`w-full p-7`} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li className="flex items-center">
                {isLast ? (
                  <span
                    className="inline-flex items-center font-medium text-gray-900"
                    aria-current="page"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span className="truncate max-w-[12ch] sm:max-w-none">{item.name}</span>
                  </span>
                ) : (
                  <Link
                    to={item.href || "#"}
                    className="inline-flex items-center hover:text-blue-600 transition-colors"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span className="truncate max-w-[12ch] sm:max-w-none">{item.name}</span>
                  </Link>
                )}
              </li>

              {!isLast && (
                <li aria-hidden="true" className="flex items-center">
                  <HiChevronRight className="text-gray-400" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
