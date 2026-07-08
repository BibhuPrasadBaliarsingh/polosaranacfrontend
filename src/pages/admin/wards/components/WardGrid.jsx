// @ts-nocheck
import WardCard from "../../../../components/admin/WardCard";

const WardGrid = ({ wards, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {wards.map((ward) => (
        <WardCard
          key={ward._id}
          ward={ward}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WardGrid;
