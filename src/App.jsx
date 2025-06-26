import React from "react";
import { AppProvider } from "./context/AppContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Router from "./components/Router";
import Modals from "./components/common/Modals";

const App = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <Modals />
      </div>
    </AppProvider>
  );
};

export default App;
