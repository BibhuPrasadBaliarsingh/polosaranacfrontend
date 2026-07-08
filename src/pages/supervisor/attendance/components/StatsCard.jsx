// @ts-nocheck
const StatsCard = ({ title, value, icon: Icon, gradient, showButton = false }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg text-white p-5 sm:p-6 bg-gradient-to-r ${gradient} hover:shadow-xl transition-all duration-300`}>
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold opacity-90">{title}</h3>
          {Icon && <Icon size={24} className="text-white/80" />}
        </div>
        <p className="text-3xl font-black">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
