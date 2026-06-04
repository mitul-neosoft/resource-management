"use client";

import { RiSearchLine } from "@remixicon/react";

export default function JobFilters() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Left Filters */}
        <div className="flex flex-wrap gap-3">
          <select className={selectClass}>
            <option>All Locations</option>
            <option>Remote</option>
            <option>Bangalore</option>
            <option>Mumbai</option>
            <option>Pune</option>
          </select>

          <select className={selectClass}>
            <option>All Types</option>
            <option>Full-time</option>
            <option>Contract</option>
            <option>Part-time</option>
          </select>

          <select className={selectClass}>
            <option>All Matches</option>
            <option>90%+ Match</option>
            <option>70%+ Match</option>
            <option>50%+ Match</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <RiSearchLine
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search role, skill, company..."
            className="w-full h-10 rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
}

const selectClass =
  "h-10 min-w-[180px] rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500";