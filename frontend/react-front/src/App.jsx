import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { RequestProvider } from "./contexts/request_context";
import { ResponseProvider } from "./contexts/response_context";
import InputsPage from "./pages/InputsPage";
import SourcesPage from "./pages/SourcesPage";
import PitchPage from "./pages/PitchPage";
import SlideDeck from "./pages/SlideDeck";
//page transitions
import { AnimatePresence, motion } from "framer-motion";

function AnimationRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <InputsPage />
            </motion.div>
          }
        />
        <Route
          path="/sources"
          element={
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <SourcesPage />
            </motion.div>
          }
        />
        <Route
          path="/pitch"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PitchPage />
            </motion.div>
          }
        />
        <Route
          path="/slide-deck"
          element={
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <SlideDeck />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ResponseProvider>
      <RequestProvider>
        <BrowserRouter>
          <AnimationRoutes />
        </BrowserRouter>
      </RequestProvider>
    </ResponseProvider>
  );
}

export default App;
