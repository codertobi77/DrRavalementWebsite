import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ZonesSection() {
  const zones = useQuery(api.cms.getZones);

  if (!zones) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-300 rounded-full px-4 py-2 h-8 w-24 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {zones.map((zone) => (
        <span 
          key={zone._id}
          className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium"
        >
          {zone.name}
        </span>
      ))}
    </div>
  );
}
