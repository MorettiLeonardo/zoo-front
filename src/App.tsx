import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AnimalList from "./pages/animals/AnimalList";
import CuidadoList from "./pages/cuidados/CuidadoList";

function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex space-x-4">
        <Link to="/animals" className="font-bold">Animais</Link>
        <Link to="/cuidados" className="font-bold">Cuidados</Link>
      </nav>

      <Routes>
        <Route path="/animals" element={<AnimalList />} />
        <Route path="/cuidados" element={<CuidadoList   />} />
      </Routes>
    </Router>
  );
}

export default App;
