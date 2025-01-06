import useBLE, { Ble } from "@/hooks/useBLE";
import { createContext, ReactNode, useContext, useState } from "react";

export type GameMode = "SINGLE" | "2P";

const ConfigContext = createContext<{
  ble: Ble;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
}>(null as any);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const ble = useBLE();
  const [gameMode, setGameMode] = useState<GameMode>("SINGLE");

  return (
    <ConfigContext.Provider value={{ ble, gameMode, setGameMode }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
