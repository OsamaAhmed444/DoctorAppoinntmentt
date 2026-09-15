import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

function AddAppointment() {
  const { user } = useContext(AuthContext)

  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [doctorError, setDoctorError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    doctor: "",
    date: "",
    reason: ""
  })

  const getLocalDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const today = getLocalDate()

  useEffect(() => {
    const controller = new AbortController()

    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true)
        setDoctorError("")

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/doctors/allDoctors`,
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

        setDoctors(data)
      } catch (error) {
        if (error.name === "AbortError") {
          return
        }

        console.error("Failed to fetch doctors:", error)

        setDoctorError(
          error.message || "Failed to fetch doctors"
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoadingDoctors(false)
        }
      }
    }

    fetchDoctors()

    return () => {
      controller.abort()
    }
  }, [])

  const handleChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.doctor ||
      !form.date ||
      !form.reason.trim()
    ) {
      toast.error("Please fill in all fields")
      return
    }

    if (form.date < today) {
      toast.error("Appointment date cannot be in the past")
      return
    }

    if (form.reason.trim().length < 3) {
      toast.error("Reason must be at least 3 characters")
      return
    }

    try {
      setSubmitting(true)

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/appointments/createAppointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            doctor: form.doctor,
            date: form.date,
            reason: form.reason.trim()
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to add appointment"
        )
      }

      toast.success("Appointment added successfully!")

      setForm({
        doctor: "",
        date: "",
        reason: ""
      })
    } catch (error) {
      console.error("Failed to add appointment:", error)

      toast.error(
        error.message || "Failed to add appointment"
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div
          className="bg-white rounded-4 shadow-sm border p-4 text-center"
          style={{ maxWidth: "500px" }}
        >
          <h3
            className="fw-bold mb-3"
            style={{ color: "#102a43" }}
          >
            Login Required
          </h3>

          <p className="text-secondary mb-0">
            You need to login to create an appointment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <section
      className="py-5 min-vh-100"
      style={{ backgroundColor: "#f4f9fb" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div
              className="bg-white rounded-4 border shadow-sm p-4 p-md-5"
              style={{ borderColor: "#e1e9ef" }}
            >
              <div className="text-center mb-4">
                <h1
                  className="fw-bold mb-2"
                  style={{ color: "#102a43" }}
                >
                  Book An Appointment
                </h1>

                <p className="text-secondary mb-0">
                  Choose a doctor and provide your appointment details.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#102a43" }}
                  >
                    Doctor
                  </label>

                  {loadingDoctors ? (
                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "#f4f9fb" }}
                    >
                      <span className="text-secondary">
                        Loading doctors...
                      </span>
                    </div>
                  ) : doctorError ? (
                    <div className="alert alert-danger mb-0">
                      {doctorError}
                    </div>
                  ) : doctors.length === 0 ? (
                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "#f4f9fb" }}
                    >
                      <span className="text-secondary">
                        No doctors available.
                      </span>
                    </div>
                  ) : (
                    <select
                      name="doctor"
                      value={form.doctor}
                      onChange={handleChange}
                      required
                      className="form-select"
                      disabled={submitting}
                    >
                      <option value="">
                        Select doctor
                      </option>

                      {doctors.map((doctor) => (
                        <option
                          key={doctor._id}
                          value={doctor._id}
                        >
                          {doctor.name} -{" "}
                          {doctor.department?.name ||
                            "No Department"}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#102a43" }}
                  >
                    Appointment Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    required
                    className="form-control"
                    disabled={submitting}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="form-label fw-semibold"
                    style={{ color: "#102a43" }}
                  >
                    Reason
                  </label>

                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    minLength="3"
                    required
                    className="form-control"
                    rows="5"
                    placeholder="Describe your reason for the appointment..."
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 py-2 fw-semibold text-white"
                  style={{
                    backgroundColor: "#087f8c",
                    borderColor: "#087f8c"
                  }}
                  disabled={
                    submitting ||
                    loadingDoctors ||
                    !!doctorError ||
                    doctors.length === 0
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Book Appointment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddAppointment