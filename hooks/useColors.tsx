export type Colors = {
  background: string;
  text: string;
  primary: string;
};

export const useColors = (): Colors => {
  const colors: Colors = {
    background: "#1B1F27",
    text: "#E5E9F0",
    primary: "#4CAF50",
  };

  return colors;
};
