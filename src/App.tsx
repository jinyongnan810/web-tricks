import { Routes, Route } from "react-router";
import Header from "./components/Header";
import Gallery from "./pages/Gallery";
import TrickDetail from "./pages/TrickDetail";

export type Category = "All" | "CSS" | "JS" | "React";

function App() {
  return (
    <div className="min-h-screen bg-page">
      <Header />
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/trick/:id" element={<TrickDetail />} />
      </Routes>
    </div>
  );
}

export default App;
