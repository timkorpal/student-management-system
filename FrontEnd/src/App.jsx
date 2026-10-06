import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import StudentsListPage from "./pages/StudentsListPage";
import StudentDeletePage from "./pages/StudentDeletePage";
import StudentAddPage from "./pages/StudentAddPage"
import StudentUpdatePage from "./pages/StudentUpdatePage"


function App() {
    return (
        <BrowserRouter>

            <NavBar />

            <main className="main-content">
                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/students"
                        element={<StudentsListPage />}
                    />

                    <Route
                        path="/student-delete"
                        element={<StudentDeletePage />}
                    />

                    <Route
                        path="/student-add"
                        element={<StudentAddPage />}
                    />

                    <Route
                        path="/student-update"
                        element={<StudentUpdatePage />}
                    />

                </Routes>
            </main>

        </BrowserRouter>
    );
}

export default App;