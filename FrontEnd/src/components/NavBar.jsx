import { Link } from "react-router-dom"
import "../css/Navbar.css"

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">Students</Link>
        </div>
        <div className="navbar-links">
            {/* <Link to="/" className="nav-link">""</Link> */}
            <Link to="/students" className="nav-link">Student List</Link>
            <Link to="/student-add" className="nav-link">Add Student</Link>
            <Link to="/student-update" className="nav-link">Update Student</Link>
            <Link to="/student-delete" className="nav-link">Delete Student</Link>
        </div>
    </nav>
}

export default NavBar