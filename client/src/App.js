import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomsPage from "./pages/RoomsPage";
import RoomSessionsPage from "./pages/RoomSessionsPage";
import SessionDetailPage from "./pages/SessionDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomsPage />} />
        <Route path="/rooms/:id" element={<RoomSessionsPage />} />
        <Route path="/rooms/:roomId/sessions/:id" element={<SessionDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;