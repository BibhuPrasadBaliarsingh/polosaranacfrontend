// @ts-nocheck
const WardCard = ({ ward, onViewDetails, onViewMap, onEdit, onDelete }) => {



  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl">🏘️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{ward.wardName}</h3>
              <p className="text-sm text-gray-600">{ward.area}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(ward);
                }}
                className="text-emerald-600 hover:text-emerald-800 p-2 rounded-full hover:bg-emerald-50 transition-colors"
                title="Edit Ward"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(ward._id);
                }}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete Ward"
              >
                🗑️
              </button>
            )}
          </div>
        </div>


        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Population</p>
            <p className="text-sm font-bold text-gray-900">{ward.population.toLocaleString()}</p>
          </div>
          <div className="bg-linear-to-br from-purple-50 to-pink-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Households</p>
            <p className="text-sm font-bold text-gray-900">{ward.household.toLocaleString()}</p>
          </div>
                    <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Waste / Day</p>
            <p className="text-sm font-bold text-gray-900">
              {ward.wasteGenerationPerDay} tons
            </p>
          </div>
           <div className="bg-linear-to-br from-orange-50 to-amber-50 p-3 rounded-xl">
            <p className="text-xs text-gray-600 font-semibold mb-1">Collection</p>
            <p className="text-sm font-bold text-gray-900 capitalize">
              {ward.collectionFrequency}
            </p>
          </div>
        </div>

        {/* Supervisor Info */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">👤 Supervisor:</span>
              <span className="text-sm font-semibold text-gray-900">{ward.supervisorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">📞 Phone:</span>
              <span className="text-sm font-semibold text-gray-900">{ward.supervisorPhone}</span>
            </div>
          </div>
        </div>
          {/* Footer */}
        <div className="bg-linear-to-r from-gray-50 to-gray-100 p-3 rounded-xl mt-4 text-xs text-gray-600">
          Created on{" "}
          <span className="font-semibold text-gray-900">
            {new Date(ward.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WardCard;
