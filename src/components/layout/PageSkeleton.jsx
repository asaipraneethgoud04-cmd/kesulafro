import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="w-full min-h-screen pt-32 px-4 md:px-8 pb-12 animate-pulse bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4 w-full md:w-1/2">
            <div className="h-10 bg-secondary/10 rounded-xl w-3/4"></div>
            <div className="h-4 bg-secondary/5 rounded-full w-full"></div>
            <div className="h-4 bg-secondary/5 rounded-full w-5/6"></div>
          </div>
          <div className="w-32 h-10 bg-secondary/10 rounded-full"></div>
        </div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/40 rounded-3xl p-6 space-y-4 border border-secondary/10">
              <div className="w-full h-48 bg-secondary/10 rounded-2xl"></div>
              <div className="h-6 bg-secondary/10 rounded-lg w-2/3"></div>
              <div className="h-4 bg-secondary/5 rounded-full w-full"></div>
              <div className="h-4 bg-secondary/5 rounded-full w-4/5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
