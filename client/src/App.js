import { BrowserRouter, Routes, Route } from "react-router-dom";
import SessionsPage from "./pages/SessionsPage";
import SessionDetailPage from "./pages/SessionDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SessionsPage />} />
        <Route path="/sessions/:id" element={<SessionDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;