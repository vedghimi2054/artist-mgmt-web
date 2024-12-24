import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || 1);

  return (
    <div className="w-full flex justify-center">
      <ul className="inline-flex -space-x-px text-base h-10">
        <li>
          <button
            className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-white ${
              currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } border border-e-0 border-gray-300 rounded-s-lg`}
            disabled={currentPage === 1}
            onClick={() => searchParams.set("page", currentPage-1)}
          >
            Previous
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <li key={page}>
              <button
                className={`flex items-center justify-center px-4 h-10 leading-tight ${
                  currentPage === page
                    ? "text-blue-600 bg-blue-50 border-blue-600 hover:bg-blue-100 hover:text-blue-700"
                    : "text-white bg-indigo-600 hover:bg-indigo-700"
                } border border-gray-300`}
                onClick={() => {searchParams.set("page", page); setSearchParams(searchParams)}}

              >
                {page}
              </button>
            </li>
          );
        })}
        <li>
          <button
            className={`flex items-center justify-center px-4 h-10 leading-tight text-white ${
              currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } border border-gray-300 rounded-e-lg`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};


export default Pagination;