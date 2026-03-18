import React, { useState } from "react";
import { LuckPickProvider } from "./context/LuckPickContext";
import Wheel from "./components/Wheel/Wheel";
import ActivityCard from "./components/ActivityCard/ActivityCard";
import HistoryList from "./components/History/HistoryList";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Landing from "./components/Landing";
import CustomizeWheelMenu from "./components/CustomizeWheelMenu/CustomizeWheelMenu";
import WheelOptionsScreen from "./components/WheelOptionsScreen/WheelOptionsScreen";

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [mode, setMode] = useState<"main" | "customize" | "wheelOptions">("main");

  return (
    <LuckPickProvider>
      {mode === "customize" ? (
        <CustomizeWheelMenu onDone={() => setMode("main")} />
      ) : mode === "wheelOptions" ? (
        <WheelOptionsScreen
          onDone={() => {
            setMode("main");
          }}
        />
      ) : hasStarted ? (
        <>
          <Header />
          <main className="lp-main">
            <section className="lp-column lp-column--primary">
              <Wheel />
              <ActivityCard />
            </section>
            <section className="lp-column lp-column--secondary">
              <HistoryList />
            </section>
          </main>
          <Footer onCustomize={() => setMode("customize")} />
        </>
      ) : (
        <Landing
          onStart={() => {
            setHasStarted(true);
            setMode("main");
          }}
          onCustomize={() => setMode("customize")}
          onWheelOptions={() => setMode("wheelOptions")}
        />
      )}
    </LuckPickProvider>
  );
}

export default App;