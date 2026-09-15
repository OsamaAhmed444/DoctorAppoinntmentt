import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import {
  Menu,
  X,
  CalendarDays,
  LogIn,
  UserPlus,
  LogOut,
  Stethoscope,
  LayoutDashboard
} from "lucide-react"
import { AuthContext } from "../context/AuthContext"

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
    <nav
      className="navbar navbar-expand-lg bg-white sticky-top"
      style={{
        borderBottom: "1px solid #e9eef3",
        zIndex: 1030
      }}
    >
      <div className="container py-2">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2"
          onClick={closeMenu}
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: "42px",
              height: "42px",
              background: "#e8f7f7"
            }}
          >
            <Stethoscope size={23} style={{ color: "#087f8c" }} />
          </div>

          <div className="lh-sm">
            <span
              className="fw-bold d-block"
              style={{
                color: "#102a43",
                fontSize: "1.15rem"
              }}
            >
              MediCare
            </span>

            <small
              style={{
                color: "#829ab1",
                fontSize: "0.7rem"
              }}
            >
              HEALTHCARE PLATFORM
            </small>
          </div>
        </Link>

        <button
          type="button"
          className="btn border-0 d-lg-none p-2"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-controls="navbarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        <div
          id="navbarContent"
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
        >
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-1 pt-3 pt-lg-0">
            <Link
              to="/"
              className="nav-link px-3 fw-semibold"
              style={{ color: "#243b53" }}
              onClick={closeMenu}
            >
              Home
            </Link>

            <a
              href="/#departments"
              className="nav-link px-3"
              style={{ color: "#486581" }}
              onClick={closeMenu}
            >
              Services
            </a>

            <a
              href="/#about"
              className="nav-link px-3"
              style={{ color: "#486581" }}
              onClick={closeMenu}
            >
              About
            </a>

            {user?.role === "admin" && (
              <>
                <Link
                  to="/appointments"
                  className="nav-link px-3 d-flex align-items-center gap-1"
                  style={{ color: "#486581" }}
                  onClick={closeMenu}
                >
                  <CalendarDays size={17} />
                  Appointments
                </Link>

                <Link
                  to="/add-doctor"
                  className="nav-link px-3"
                  style={{ color: "#486581" }}
                  onClick={closeMenu}
                >
                  Add Doctor
                </Link>

                <Link
                  to="/add-department"
                  className="nav-link px-3"
                  style={{ color: "#486581" }}
                  onClick={closeMenu}
                >
                  Add Department
                </Link>
              </>
            )}

            {user?.role === "user" && (
              <>
                <Link
                  to="/my-appointments"
                  className="nav-link px-3 d-flex align-items-center gap-1"
                  style={{ color: "#486581" }}
                  onClick={closeMenu}
                >
                  <CalendarDays size={17} />
                  My Appointments
                </Link>

                <Link
                  to="/add-appointment"
                  className="btn ms-lg-2 px-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: "#087f8c",
                    color: "#fff",
                    borderRadius: "10px"
                  }}
                  onClick={closeMenu}
                >
                  <CalendarDays size={17} />
                  Book Appointment
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="nav-link px-3 d-flex align-items-center gap-1"
                  style={{ color: "#486581" }}
                  onClick={closeMenu}
                >
                  <LogIn size={17} />
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn ms-lg-2 px-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: "#087f8c",
                    color: "#fff",
                    borderRadius: "10px"
                  }}
                  onClick={closeMenu}
                >
                  <UserPlus size={17} />
                  Get Started
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <Link
                to="/"
                className="btn ms-lg-2 px-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{
                  background: "#102a43",
                  color: "#fff",
                  borderRadius: "10px"
                }}
                onClick={closeMenu}
              >
                <LayoutDashboard size={17} />
                Admin
              </Link>
            )}

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-sm ms-lg-2 mt-2 mt-lg-0 d-flex align-items-center justify-content-center gap-1"
                style={{
                  color: "#d64545",
                  border: "1px solid #f0b8b8",
                  borderRadius: "9px"
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar