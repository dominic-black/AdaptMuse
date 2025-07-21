export const PageHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="font-bold text-color-text text-4xl">{title}</h1>
    </div>
  );
};
