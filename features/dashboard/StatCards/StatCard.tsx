export const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-4 bg-white shadow-sm p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-shrink-0 justify-center items-center bg-primary/10 rounded-full w-10 h-10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="font-semibold text-gray-900 text-xl">{value}</p>
      </div>
    </div>
  );
};
