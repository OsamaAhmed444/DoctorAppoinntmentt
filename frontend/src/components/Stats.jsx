import React, { useEffect, useState } from "react"
import {
  UserRound,
  Building2,
  FlaskConical,
  Award,
  ArrowUpRight
} from "lucide-react"

function Stats() {
  const [doctorsCount, setDoctorsCount] = useState(0)
  const [departmentsCount, setDepartmentsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError("")

        const doctorsStats = await fetch(
          `${import.meta.env.VITE_API_URL}/doctors/count`
        )

        const doctorsData = await doctorsStats.json()

        if (!doctorsStats.ok) {
          throw new Error(
            doctorsData.message || "Failed to fetch doctors count"
          )
        }

        const departmentsStats = await fetch(
          `${import.meta.env.VITE_API_URL}/departments/count`
        )

        const departmentsData = await departmentsStats.json()

        if (!departmentsStats.ok) {
          throw new Error(
            departmentsData.message ||
              "Failed to fetch departments count"
          )
        }

        setDoctorsCount(doctorsData.count || 0)
        setDepartmentsCount(departmentsData.count || 0)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError(error.message || "Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const stats = [
    {
      icon: UserRound,
      count: doctorsCount,
      label: "Medical Doctors"
    },
    {
      icon: Building2,
      count: departmentsCount,
      label: "Specialized Departments"
    },
    {
      icon: FlaskConical,
      count: 8,
      label: "Research Labs"
    },
    {
      icon: Award,
      count: 150,
      label: "Awards & Recognitions"
    }
  ]

  return (
    <section
      className="py-5"
      style={{ background: "#f4f9fb" }}
    >
      <div className="container">
        {loading && (
          <div className="text-center py-4">
            <div
              className="spinner-border"
              role="status"
              style={{ color: "#087f8c" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div
            className="text-center py-4"
            style={{ color: "#d64545" }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row g-3">
            {stats.map((item, index) => {
              const Icon = item.icon

              return (
                <div
                  className="col-12 col-sm-6 col-lg-3"
                  key={index}
                >
                  <div
                    className="h-100 p-4"
                    style={{
                      background: "#fff",
                      border: "1px solid #e1e9ef",
                      borderRadius: "16px"
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-3"
                        style={{
                          width: "46px",
                          height: "46px",
                          background: "#e8f7f7",
                          color: "#087f8c"
                        }}
                      >
                        <Icon size={22} />
                      </div>

                      <ArrowUpRight
                        size={18}
                        style={{ color: "#9fb3c8" }}
                      />
                    </div>

                    <div className="mt-4">
                      <div
                        className="fw-bold"
                        style={{
                          color: "#102a43",
                          fontSize: "2rem"
                        }}
                      >
                        {item.count}
                      </div>

                      <p
                        className="mb-0 mt-1"
                        style={{ color: "#627d98" }}
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Stats