import React, { useEffect, useState } from "react"
import {
  ArrowRight,
  Building2,
  UsersRound
} from "lucide-react"
import { Link } from "react-router-dom"

function Departments() {
  const [departments, setDepartments] = useState([])
  const [activeTab, setActiveTab] = useState(null)
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [departmentError, setDepartmentError] = useState("")
  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [doctorError, setDoctorError] = useState("")

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true)
        setDepartmentError("")

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/departments/allDepartments`
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch departments")
        }

        setDepartments(data)

        if (data.length > 0) {
          setActiveTab(data[0]._id)
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error)
        setDepartmentError(error.message || "Failed to fetch departments")
        setDepartments([])
      } finally {
        setLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [])

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!activeTab) {
        setDoctors([])
        return
      }

      try {
        setLoadingDoctors(true)
        setDoctorError("")

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/doctors/byDepartment/${activeTab}`
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch doctors")
        }

        setDoctors(data)
      } catch (error) {
        console.error("Failed to fetch department doctors:", error)
        setDoctorError(error.message || "Failed to fetch doctors")
        setDoctors([])
      } finally {
        setLoadingDoctors(false)
      }
    }

    fetchDoctors()
  }, [activeTab])

  const activeDepartment = departments.find(
    (department) => department._id === activeTab
  )

  return (
    <section
      id="departments"
      className="py-5"
      style={{ background: "#f4f9fb" }}
    >
      <div className="container py-lg-4">
        <div className="mb-5">
          <span
            className="fw-bold small"
            style={{
              color: "#087f8c",
              letterSpacing: "0.12em"
            }}
          >
            SPECIALIZED CARE
          </span>

          <h2
            className="fw-bold mt-2 mb-2"
            style={{
              color: "#102a43",
              fontSize: "clamp(2rem, 4vw, 2.8rem)"
            }}
          >
            Explore our departments
          </h2>

          <p
            className="text-secondary mb-0"
            style={{
              maxWidth: "650px",
              lineHeight: "1.7"
            }}
          >
            Find the medical specialty that matches your needs and explore the
            doctors available within each department.
          </p>
        </div>

        {loadingDepartments && (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "#087f8c" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loadingDepartments && departmentError && (
          <div
            className="alert mb-0"
            style={{
              background: "#fff1f1",
              color: "#b42318",
              border: "1px solid #ffd4d4"
            }}
          >
            {departmentError}
          </div>
        )}

        {!loadingDepartments &&
          !departmentError &&
          departments.length === 0 && (
            <div className="text-center py-5">
              <p className="text-secondary mb-0">
                No departments available.
              </p>
            </div>
          )}

        {!loadingDepartments &&
          !departmentError &&
          departments.length > 0 && (
            <div className="row g-4">
              <div className="col-12 col-lg-4">
                <div className="d-flex flex-column gap-2">
                  {departments.map((dep) => (
                    <button
                      key={dep._id}
                      type="button"
                      onClick={() => setActiveTab(dep._id)}
                      className="btn text-start p-3 d-flex align-items-center justify-content-between"
                      style={{
                        background:
                          activeTab === dep._id ? "#102a43" : "#fff",
                        color:
                          activeTab === dep._id ? "#fff" : "#243b53",
                        border:
                          activeTab === dep._id
                            ? "1px solid #102a43"
                            : "1px solid #e1e9ef",
                        borderRadius: "13px",
                        minHeight: "58px"
                      }}
                    >
                      <span className="fw-semibold">{dep.name}</span>

                      <ArrowRight
                        size={18}
                        style={{
                          opacity: activeTab === dep._id ? 1 : 0.45
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-12 col-lg-8">
                {activeDepartment && (
                  <div
                    className="h-100 overflow-hidden"
                    style={{
                      background: "#fff",
                      border: "1px solid #e1e9ef",
                      borderRadius: "20px"
                    }}
                  >
                    <div className="row g-0 h-100">
                      <div className="col-12 col-md-5">
                        {activeDepartment.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL}/uploads/${activeDepartment.image}`}
                            alt={activeDepartment.name}
                            className="w-100 h-100"
                            style={{
                              minHeight: "360px",
                              objectFit: "cover"
                            }}
                          />
                        ) : (
                          <div
                            className="w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{
                              minHeight: "260px",
                              background: "#e8f7f7"
                            }}
                          >
                            <Building2
                              size={65}
                              style={{ color: "#087f8c" }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-7">
                        <div className="p-4 p-lg-5">
                          <span
                            className="small fw-semibold"
                            style={{ color: "#087f8c" }}
                          >
                            MEDICAL DEPARTMENT
                          </span>

                          <h3
                            className="fw-bold mt-2 mb-3"
                            style={{ color: "#102a43" }}
                          >
                            {activeDepartment.name}
                          </h3>

                          <p
                            className="text-secondary"
                            style={{ lineHeight: "1.75" }}
                          >
                            {activeDepartment.description ||
                              "No description available for this department."}
                          </p>

                          <Link
                            to={`/department/${activeDepartment._id}`}
                            className="text-decoration-none fw-semibold d-inline-flex align-items-center gap-2 mb-4"
                            style={{ color: "#087f8c" }}
                          >
                            Explore department
                            <ArrowRight size={17} />
                          </Link>

                          <div
                            className="pt-4"
                            style={{ borderTop: "1px solid #edf2f5" }}
                          >
                            <div className="d-flex align-items-center gap-2 mb-3">
                              <UsersRound
                                size={19}
                                style={{ color: "#087f8c" }}
                              />

                              <h4
                                className="h6 fw-bold mb-0"
                                style={{ color: "#102a43" }}
                              >
                                Available doctors
                              </h4>
                            </div>

                            {loadingDoctors ? (
                              <p className="text-secondary small mb-0">
                                Loading doctors...
                              </p>
                            ) : doctorError ? (
                              <p
                                className="small mb-0"
                                style={{ color: "#d64545" }}
                              >
                                {doctorError}
                              </p>
                            ) : doctors.length > 0 ? (
                              <div className="d-flex flex-column gap-2">
                                {doctors.slice(0, 3).map((doctor) => (
                                  <Link
                                    key={doctor._id}
                                    to={`/doctor/${doctor._id}`}
                                    className="text-decoration-none"
                                  >
                                    <div className="d-flex align-items-center gap-3">
                                      <img
                                        src={`${import.meta.env.VITE_API_URL}/uploads/${doctor.image}`}
                                        alt={doctor.name}
                                        className="rounded-circle"
                                        width="45"
                                        height="45"
                                        style={{ objectFit: "cover" }}
                                      />

                                      <div>
                                        <span
                                          className="d-block small fw-semibold"
                                          style={{ color: "#243b53" }}
                                        >
                                          {doctor.name}
                                        </span>

                                        <span
                                          className="small"
                                          style={{ color: "#829ab1" }}
                                        >
                                          {doctor.experienceYears} years
                                          experience
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <p className="text-secondary small mb-0">
                                No doctors found in this department.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </section>
  )
}

export default Departments