import { BrowserRouter, Routes, Route } from "react-router-dom";
import InputsPage from "./pages/InputsPage";
import SourcesPage from "./pages/SourcesPage";
import PitchPage from "./pages/PitchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={InputsPage} />
        <Route path="/sources" Component={SourcesPage} />
        <Route path="/pitch" Component={PitchPage} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
