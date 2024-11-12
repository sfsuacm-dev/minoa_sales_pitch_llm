import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RequestProvider } from "./contexts/request_context";
import { ResponseProvider } from "./contexts/response_context";
import InputsPage from "./pages/InputsPage";
import SourcesPage from "./pages/SourcesPage";
import PitchPage from "./pages/PitchPage";

function App() {
  return (
    <ResponseProvider>
      <RequestProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={InputsPage} />
            <Route path="/sources" Component={SourcesPage} />
            <Route path="/pitch" Component={PitchPage} />
          </Routes>
        </BrowserRouter>
      </RequestProvider>
    </ResponseProvider>
  );
}

export default App;
