import React from 'react';

const interstellarObjects = [
  {
    name: "1I/'Oumuamua",
    discovered: "October 19, 2017",
    type: "Rocky/Metallic (uncertain)",
    size: "~100-400m length",
    velocity: "26.33 km/s",
    origin: "Lyra constellation direction",
    unique: "Cigar/pancake shape, unexpected acceleration",
    status: "Left solar system 2018"
  },
  {
    name: "2I/Borisov",
    discovered: "August 30, 2019",
    type: "Active comet",
    size: "~500m-1km diameter",
    velocity: "32 km/s",
    origin: "Cassiopeia direction",
    unique: "Carbon monoxide rich, pristine composition",
    status: "Left solar system 2020"
  },
  {
    name: "3I/ATLAS",
    discovered: "July 1, 2025",
    type: "Active comet",
    size: "Up to 20km diameter",
    velocity: "~60 km/s",
    origin: "Unknown (hyperbolic trajectory)",
    unique: "Largest known interstellar object, high velocity",
    status: "Currently approaching (Pre-Perihelion)"
  }
];

const InterstellarComparison: React.FC = () => {
  return (
    <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
      <h2 className="text-2xl font-bold text-comet-blue-200 mb-4">Interstellar Object Comparison</h2>
      <p className="text-sm text-comet-blue-400 mb-6">
        3I/ATLAS is only the third confirmed interstellar visitor. Here's how it compares to the previous two:
      </p>

      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
          <thead className="border-b-2 border-comet-blue-700 text-comet-blue-300">
            <tr>
              <th className="p-2 sm:p-3">Property</th>
              <th className="p-2 sm:p-3">1I/'Oumuamua</th>
              <th className="p-2 sm:p-3">2I/Borisov</th>
              <th className="p-2 sm:p-3 bg-comet-blue-800/50">3I/ATLAS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-comet-blue-800">
              <td className="p-2 sm:p-3 font-semibold text-comet-blue-200">Discovered</td>
              <td className="p-2 sm:p-3 text-comet-blue-400">{interstellarObjects[0].discovered}</td>
              <td className="p-2 sm:p-3 text-comet-blue-400">{interstellarObjects[1].discovered}</td>
              <td className="p-2 sm:p-3 text-comet-blue-100 bg-comet-blue-800/30">{interstellarObjects[2].discovered}</td>
            </tr>
            <tr className="border-b border-comet-blue-800">
              <td className="p-2 sm:p-3 font-semibold text-comet-blue-200">Type</td>
              <td className="p-2 sm:p-3 text-comet-blue-400">{interstellarObjects[0].type}</td>
              <td className="p-2 sm:p-3 text-comet-blue-400">{interstellarObjects[1].type}</td>
              <td className="p-2 sm:p-3 text-comet-blue-100 bg-comet-blue-800/30">{interstellarObjects[2].type}</td>
            </tr>
            <tr className="border-b border-comet-blue-800">
              <td className="p-2 sm:p-3 font-semibold text-comet-blue-200">Size</td>
              <td className="p-2 sm:p-3 text-comet-blue-400">{interstellarObjects[0].size}</td>
              <td className="p-2 sm:p-3 text-comet-blue-400">{interstellarObjects[1].size}</td>
              <td className="p-2 sm:p-3 text-comet-blue-100 bg-comet-blue-800/30 font-bold">{interstellarObjects[2].size} ⭐</td>
            </tr>
            <tr className="border-b border-comet-blue-800">
              <td className="p-2 sm:p-3 font-semibold text-comet-blue-200">Velocity</td>
              <td className="p-2 sm:p-3 text-comet-blue-400">{interstellarObjects[0].velocity}</td>
              <td className="p-2 sm:p-3 text-comet-blue-400">{interstellarObjects[1].velocity}</td>
              <td className="p-2 sm:p-3 text-comet-blue-100 bg-comet-blue-800/30 font-bold">{interstellarObjects[2].velocity} ⭐</td>
            </tr>
            <tr className="border-b border-comet-blue-800">
              <td className="p-2 sm:p-3 font-semibold text-comet-blue-200">Unique Features</td>
              <td className="p-2 sm:p-3 text-comet-blue-400 text-xs">{interstellarObjects[0].unique}</td>
              <td className="p-2 sm:p-3 text-comet-blue-400 text-xs">{interstellarObjects[1].unique}</td>
              <td className="p-2 sm:p-3 text-comet-blue-100 bg-comet-blue-800/30 text-xs">{interstellarObjects[2].unique}</td>
            </tr>
            <tr>
              <td className="p-2 sm:p-3 font-semibold text-comet-blue-200">Current Status</td>
              <td className="p-2 sm:p-3 text-comet-blue-500 text-xs">{interstellarObjects[0].status}</td>
              <td className="p-2 sm:p-3 text-comet-blue-500 text-xs">{interstellarObjects[1].status}</td>
              <td className="p-2 sm:p-3 text-green-400 bg-comet-blue-800/30 text-xs font-bold">{interstellarObjects[2].status}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-comet-blue-800/30 rounded-md border border-comet-blue-700">
        <p className="text-xs text-comet-blue-300">
          <strong className="text-comet-blue-100">What makes 3I/ATLAS special:</strong> It's significantly larger than previous interstellar visitors and moving faster.
          As an active comet, it provides unique opportunities to study interstellar material composition through spectroscopy as it sublimates.
        </p>
      </div>
    </div>
  );
};

export default InterstellarComparison;
