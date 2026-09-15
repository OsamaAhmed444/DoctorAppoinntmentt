import React, { useEffect, useState } from "react"
import {
  ArrowRight,
  BriefcaseMedical
} from "lucide-react"
import { Link } from "react-router-dom"

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        setError("")

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/doctors/allDoctors`
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch doctors")
        }

        setDoctors(data.slice(0, 3))
      } catch (error) {
        console.error("Failed to fetch doctors:", error)
        setError(error.message || "Failed to fetch doctors")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  return (
    <section
      id="doctors"
      className="py-5"
      style={{ background: "#fff" }}
    >
      <div className="container py-lg-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-5">
          <div>
            <span
              className="fw-bold small"
              style={{
                color: "#087f8c",
                letterSpacing: "0.12em"
              }}
            >
              OUR SPECIALISTS
            </span>

            <h2
              className="fw-bold mt-2 mb-2"
              style={{
                color: "#102a43",
                fontSize: "clamp(2rem, 4vw, 2.8rem)"
              }}
            >
              Meet our doctors
            </h2>

            <p
              className="text-secondary mb-0"
              style={{ maxWidth: "600px" }}
            >
              Explore experienced professionals ready to help you with your
              healthcare needs.
            </p>
          </div>

          <Link
            to="/allDoctors"
            className="text-decoration-none fw-semibold d-inline-flex align-items-center gap-2"
            style={{ color: "#087f8c" }}
          >
            View all doctors
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading && (
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

        {!loading && error && (
          <div className="text-center py-5">
            <p className="mb-0" style={{ color: "#d64545" }}>
              {error}
            </p>
          </div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <div className="text-center py-5">
            <p className="text-secondary mb-0">
              No doctors available at the moment.
            </p>
          </div>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="row g-4">
            {doctors.map((doc) => (
              <div
                className="col-12 col-md-4"
                key={doc._id}
              >
                <Link
                  to={`/doctor/${doc._id}`}
                  className="text-decoration-none"
                >
                  <article
                    className="h-100 overflow-hidden"
                    style={{
                      background: "#fff",
                      border: "1px solid #e1e9ef",
                      borderRadius: "20px",
                      transition:
                        "transform .2s ease, box-shadow .2s ease"
                    }}
                  >
                    <div
                      className="position-relative"
                      style={{ background: "#e8f7f7" }}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${doc.image}`}
                        alt={doc.name}
                        className="w-100"
                        style={{
                          height: "300px",
                          objectFit: "cover"
                        }}
                      />

                      <span
                        className="position-absolute bottom-0 start-0 m-3 px-3 py-2 rounded-pill small fw-semibold d-flex align-items-center gap-1"
                        style={{
                          background: "#fff",
                          color: "#087f8c",
                          boxShadow: "0 6px 18px rgba(16,42,67,0.12)"
                        }}
                      >
                        <BriefcaseMedical size={15} />
                        {doc.experienceYears} years
                      </span>
                    </div>

                    <div className="p-4">
                      <h3
                        className="h5 fw-bold mb-2"
                        style={{ color: "#102a43" }}
                      >
                        {doc.name}
                      </h3>

                      <p
                        className="mb-3"
                        style={{ color: "#087f8c" }}
                      >
                        {doc.department?.name || "No Department"}
                      </p>

                      <div
                        className="d-flex align-items-center justify-content-between pt-3"
                        style={{ borderTop: "1px solid #edf2f5" }}
                      >
                        <span
                          className="small"
                          style={{ color: "#829ab1" }}
                        >
                          View profile
                        </span>

                        <ArrowRight
                          size={18}
                          style={{ color: "#087f8c" }}
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Doctors