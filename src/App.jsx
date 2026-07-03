import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router";
import BoardList from "./components/BoardList";
import Write from "./components/Write";

function App() {
  return (
    <div className="container">
      <h1>React BBS</h1>
      <Routes>
        <Route path="/" element={<BoardList />} />
        <Route path="/write" element={<Write />} />
        {/* <Route path="/view/:id" element={<view />} /> */}
      </Routes>
    </div>
  );
}

export default App;
