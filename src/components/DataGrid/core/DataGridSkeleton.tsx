import React from 'react';

const DataGridSkeleton = ({ rows = 10, columns = 5 }: { rows?: number; columns?: number })=> {
  return (
    <div className="border rounded-md shadow-sm overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-2 text-left">
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default DataGridSkeleton
