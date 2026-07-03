import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router";
import BoardList from "./components/BoardList";
import Write from "./components/Write";
import View from "./components/View";
import { useState } from "react";

function App() {
  const [boardId, setBoardId] = useState(0);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const navigate = useNavigate();
  const handleModify = _id => {
    setBoardId(_id);
    setIsModifyMode(true);
    navigate("/write");
  };

  return (
    <div className="container">
      <h1>React BBS</h1>

      <Routes>
        <Route path="/" element={<BoardList />} />

        <Route path="/write" element={<Write isModifyMode={isModifyMode} boardId={boardId} />} />

        <Route path="/view/:id" element={<View handleModify={handleModify} />} />
      </Routes>
    </div>
  );
}

export default App;
