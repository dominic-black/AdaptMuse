export const ActionButton = ({
  selected,
  onClick,
  icon,
  text,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
      selected
        ? "border-primary bg-primary/5 shadow-md"
        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </button>
);
