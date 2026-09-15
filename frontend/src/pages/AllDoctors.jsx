import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// ==================== Component & State ====================

function AllDoctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [departmentsLoading, setDepartmentsLoading] = useState(true)
  const [departmentsError, setDepartmentsError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const doctorsPerPage = 6

  // ==================== Fetch Departments ====================

  useEffect(() => {
    const controller = new AbortController()

    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true)
        setDepartmentsError("")

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/departments/allDepartments`,
          {
            signal: controller.signal
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch departments"
          )
        }

        setDepartments(data)
      } catch (error) {
        if (error.name === "AbortError") return

        console.error("Failed to fetch departments:", error)
        setDepartments([])
        setDepartmentsError(
          error.message || "Failed to fetch departments"
        )
      } finally {
        if (!controller.signal.aborted) {
          setDepartmentsLoading(false)
        }
      }
    }

    fetchDepartments()

    return () => {
      controller.abort()
    }
  }, [])

  // ==================== Fetch Doctors ====================

  useEffect(() => {
    const controller = new AbortController()

    const fetchDoctors = async () => {
      try {
        setLoading(true)
        setError("")

        const params = new URLSearchParams()

        if (search.trim()) {
          params.append("search", search.trim())
        }

        if (selectedDepartment) {
          params.append("department", selectedDepartment)
        }

        params.append("page", currentPage)
        params.append("limit", doctorsPerPage)

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/doctors/search?${params.toString()}`,
          {
            signal: controller.signal
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch doctors"
          )
        }

        setDoctors(data.doctors || [])
        setTotalDoctors(data.totalDoctors || 0)
        setTotalPages(data.totalPages || 0)
      } catch (error) {
        if (error.name === "AbortError") return

        console.error("Failed to fetch doctors:", error)

        setError(
          error.message || "Failed to fetch doctors"
        )

        setDoctors([])
        setTotalDoctors(0)
        setTotalPages(0)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    const timeoutId = setTimeout(() => {
      fetchDoctors()
    }, 400)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [search, selectedDepartment, currentPage])

  // ==================== Search & Filter Handlers ====================

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value)
    setCurrentPage(1)
  }

  // ==================== Pagination Handler ====================

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return

    setCurrentPage(page)

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  // ==================== Main Section ====================

  return (
    <section
      className="py-5 min-vh-100"
      style={{ backgroundColor: "#f4f9fb" }}
    >
      <div className="container">

        {/* ==================== Page Header ==================== */}

        <div className="text-center mb-5">
          <h1
            className="fw-bold mb-2"
            style={{ color: "#102a43" }}
          >
            Our Doctors
          </h1>

          <p className="text-secondary mb-0">
            Find the right doctor for your healthcare needs.
          </p>
        </div>

        {/* ==================== Search & Department Filters ==================== */}

        <div
          className="bg-white rounded-4 border shadow-sm p-4 mb-5"
          style={{ borderColor: "#e1e9ef" }}
        >
          <div className="row g-4">
            <div className="col-12 col-md-7">
              <label
                htmlFor="doctorSearch"
                className="form-label fw-semibold"
              >
                Search Doctor
              </label>

              <input
                id="doctorSearch"
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by doctor name..."
                className="form-control"
                disabled={loading && !doctors.length}
              />
            </div>

            <div className="col-12 col-md-5">
              <label
                htmlFor="departmentFilter"
                className="form-label fw-semibold"
              >
                Filter By Department
              </label>

              {departmentsLoading ? (
                <select
                  id="departmentFilter"
                  className="form-select"
                  disabled
                >
                  <option>Loading departments...</option>
                </select>
              ) : departmentsError ? (
                <div>
                  <select
                    id="departmentFilter"
                    className="form-select"
                    disabled
                  >
                    <option>
                      Unable to load departments
                    </option>
                  </select>

                  <small className="text-danger">
                    {departmentsError}
                  </small>
                </div>
              ) : (
                <select
                  id="departmentFilter"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="form-select"
                >
                  <option value="">
                    All Departments
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department._id}
                      value={department._id}
                    >
                      {department.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* ==================== Doctors Count ==================== */}

        {!loading && !error && totalDoctors > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2
              className="h5 fw-bold mb-0"
              style={{ color: "#102a43" }}
            >
              Available Doctors
            </h2>

            <span className="text-secondary small">
              Showing {doctors.length} of {totalDoctors} doctors
            </span>
          </div>
        )}

        {/* ==================== Loading State ==================== */}

        {loading && (
          <div className="text-center py-5">
            <div
              className="spinner-border mb-3"
              style={{ color: "#087f8c" }}
              role="status"
            />

            <p className="text-secondary mb-0">
              Loading doctors...
            </p>
          </div>
        )}

        {/* ==================== Error State ==================== */}

        {!loading && error && (
          <div
            className="bg-white rounded-4 border shadow-sm text-center p-5"
            style={{ borderColor: "#e1e9ef" }}
          >
            <h4 className="fw-bold text-danger mb-2">
              Failed To Load Doctors
            </h4>

            <p className="text-secondary mb-0">
              {error}
            </p>
          </div>
        )}

        {/* ==================== Empty State ==================== */}

        {!loading && !error && doctors.length === 0 && (
          <div
            className="bg-white rounded-4 border shadow-sm text-center p-5"
            style={{ borderColor: "#e1e9ef" }}
          >
            <h4
              className="fw-bold mb-2"
              style={{ color: "#102a43" }}
            >
              No Doctors Found
            </h4>

            <p className="text-secondary mb-0">
              Try changing your search or department filter.
            </p>
          </div>
        )}

        {/* ==================== Doctors Grid ==================== */}

        {!loading && !error && doctors.length > 0 && (
          <div className="row g-4">
            {doctors.map((doc) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={doc._id}
              >
                <Link
                  to={`/doctor/${doc._id}`}
                  className="text-decoration-none"
                >
                  <div
                    className="bg-white rounded-4 border shadow-sm p-4 text-center h-100"
                    style={{ borderColor: "#e1e9ef" }}
                  >
                    <img
                      className="rounded-circle object-fit-cover border mb-4"
                      src={`${import.meta.env.VITE_API_URL}/uploads/${doc.image}`}
                      alt={doc.name}
                      width="140"
                      height="140"
                    />

                    <h3
                      className="h5 fw-bold mb-2"
                      style={{ color: "#102a43" }}
                    >
                      {doc.name}
                    </h3>

                    <p
                      className="mb-2 fw-semibold"
                      style={{ color: "#087f8c" }}
                    >
                      {doc.department?.name || "No Department"}
                    </p>

                    <p className="small text-secondary mb-0">
                      {doc.experienceYears} Years Of Experience
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* ==================== Pagination ==================== */}

        {!loading && !error && totalPages > 1 && (
          <nav
            className="mt-5"
            aria-label="Doctors pagination"
          >
            <ul className="pagination justify-content-center mb-0">
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    goToPage(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    goToPage(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </section>
  )
}

export default AllDoctors