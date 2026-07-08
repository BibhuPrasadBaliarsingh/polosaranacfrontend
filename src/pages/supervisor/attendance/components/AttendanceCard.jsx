// @ts-nocheck
import { User, CheckCircle2, XCircle, MapPin, Phone, Clock } from "lucide-react";

const AttendanceCard = ({ member }) => {
  const getStatusColor = (status) => {
    const colors = {
      Present: { bg: 'bg-emerald-500', text: 'text-emerald-600', badge: 'from-emerald-500 to-teal-500' },
      Absent: { bg: 'bg-red-500', text: 'text-red-600', badge: 'from-red-500 to-rose-500' },
      Leave: { bg: 'bg-blue-500', text: 'text-blue-600', badge: 'from-blue-500 to-indigo-500' },
      Late: { bg: 'bg-orange-500', text: 'text-orange-600', badge: 'from-orange-500 to-amber-500' },
      'Half-Day': { bg: 'bg-purple-500', text: 'text-purple-600', badge: 'from-purple-500 to-pink-500' }
    };
    return colors[status] || colors.Present;
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      Present: <CheckCircle2 size={20} className="text-white" />,
      Absent: <XCircle size={20} className="text-white" />,
      Leave: <Clock size={20} className="text-white" />,
      Late: <Clock size={20} className="text-white" />,
      'Half-Day': <Clock size={20} className="text-white" />
    };
    return iconMap[status] || <CheckCircle2 size={20} className="text-white" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor(member.status).badge} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
            <User size={24} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900 truncate">{member.name}</h3>
            <p className="text-sm text-gray-600 truncate">{member.role || 'Staff'}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
          <span className={`bg-gradient-to-r ${getStatusColor(member.status).badge} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap flex items-center gap-1`}>
            {member.status}
          </span>
          <div className="text-emerald-600">
            {getStatusIcon(member.status)}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <MapPin size={16} />
            Ward:
          </span>
          <span className="text-sm font-semibold text-gray-900">{member.assignedWard || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <Phone size={16} />
            Phone:
          </span>
          <span className="text-sm font-semibold text-gray-900">{member.phone || 'N/A'}</span>
        </div>
      </div>

      {/* Time Info */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-600 mb-1 flex items-center gap-1">
              <Clock size={14} />
              Check In
            </p>
            <p className="font-bold text-gray-900">{member.checkInTime || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1 flex items-center gap-1">
              <Clock size={14} />
              Check Out
            </p>
            <p className="font-bold text-gray-900">{member.checkOutTime || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
