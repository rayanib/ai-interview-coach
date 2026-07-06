import { NavLink, Route, Routes } from "react-router-dom";
import FinalReport from "./pages/FinalReport.jsx";
import Home from "./pages/Home.jsx";
import Interview from "./pages/Interview.jsx";
import JobDescription from "./pages/JobDescription.jsx";
import UploadCV from "./pages/UploadCV.jsx";

// This component provides the shared navigation and page routes.
export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/">AI Interview Coach</NavLink>
        <nav aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/upload">Upload CV</NavLink>
          <NavLink to="/job">Job</NavLink>
          <NavLink to="/interview">Interview</NavLink>
          <NavLink to="/report">Report</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadCV />} />
          <Route path="/job" element={<JobDescription />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/report" element={<FinalReport />} />
        </Routes>
      </main>
    </div>
  );
}
