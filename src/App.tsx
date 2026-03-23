import React, { useState } from "react";
import { LuckPickProvider } from "./state/luckpick/LuckPickProvider";
import Wheel from "./features/wheel/Wheel";
import ActivityCard from "./features/activities/ActivityCard";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import Landing from "./screens/Landing";
import CustomizeWheelMenu from "./features/customize/CustomizeWheelMenu";
import WheelOptionsScreen from "./screens/WheelOptionsScreen";

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [mode, setMode] = useState<"main" | "customize" | "wheelOptions">(
    "main",
  );

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
        <div className="lp-app-mainScreen">
          <Header />
          <main className="lp-main">
            <section className="lp-column lp-column--primary">
              <Wheel />
              <ActivityCard />
            </section>
          </main>
          <Footer onGoBack={() => setHasStarted(false)} />
        </div>
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
