export const Cell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-cell-background shadow-gray-200/50 shadow-lg p-4 rounded-md">
      {children}
    </div>
  );
};
