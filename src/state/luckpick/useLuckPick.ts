import { useContext } from "react";
import { LuckPickContext } from "./luckPickCore";

export const useLuckPick = () => {
  const ctx = useContext(LuckPickContext);
  if (!ctx) {
    throw new Error("useLuckPick must be used within LuckPickProvider");
  }
  return ctx;
};
