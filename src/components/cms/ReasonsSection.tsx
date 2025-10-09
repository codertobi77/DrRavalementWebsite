import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ReasonsSection() {
  const reasons = useQuery(api.cms.getReasons);

  if (!reasons) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="text-center animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-3"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {reasons.map((reason) => (
        <div key={reason._id} className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className={`${reason.icon} text-2xl text-white`}></i>
          </div>
          <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
          <p className="text-gray-300">{reason.description}</p>
        </div>
      ))}
    </div>
  );
}
