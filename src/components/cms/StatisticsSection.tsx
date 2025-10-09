import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function StatisticsSection() {
  const statistics = useQuery(api.cms.getStatistics);

  if (!statistics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="text-center animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
      {statistics.map((stat) => (
        <div key={stat._id} className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            {stat.value}
          </div>
          <div className="text-orange-200 font-medium text-xs sm:text-sm lg:text-base">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
