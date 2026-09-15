import { Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Navbar from "./components/Navbar"
import Login from "./components/Login"
import Register from "./components/Register"
import ProtectedRoute from "./components/ProtectedRoute"

import Home from "./pages/Home"
import AllDoctors from "./pages/AllDoctors"
import DoctorDetails from "./pages/DoctorDetails"
import DepartmentDetails from "./pages/DepartmentDetails"
import AddAppointment from "./pages/AddAppointment"
import MyAppointments from "./pages/MyAppointments"
import Appointments from "./pages/Appointments"
import AddDoctor from "./pages/AddDoctor"
import AddDepartment from "./pages/AddDepartment"

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/allDoctors" element={<AllDoctors />} />
          <Route path="/doctor/:id" element={<DoctorDetails />} />
          <Route
            path="/department/:id"
            element={<DepartmentDetails />}
          />

          <Route
            path="/add-appointment"
            element={
              <ProtectedRoute>
                <AddAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <ProtectedRoute requiredRole="admin">
                <Appointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-doctor"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddDoctor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-department"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddDepartment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  )
}

export default App