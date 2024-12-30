import { createContext, ReactNode, useContext, useState } from "react";

export type GameMode = "SINGLE" | "2P";

const ConfigContext = createContext<{
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
}>(null as any);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [gameMode, setGameMode] = useState<GameMode>("SINGLE");

  return (
    <ConfigContext.Provider value={{ gameMode, setGameMode }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
