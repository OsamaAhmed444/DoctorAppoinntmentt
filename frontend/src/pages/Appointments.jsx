import { useEffect, useState } from "react"
import { toast } from "react-toastify"

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editDate, setEditDate] = useState("")
  const [editReason, setEditReason] = useState("")
  const [updatingId, setUpdatingId] = useState(null)

  const getLocalDateTime = () => {
    const now = new Date()
    const offset = now.getTimezoneOffset()
    const localDate = new Date(now.getTime() - offset * 60000)

    return localDate.toISOString().slice(0, 16)
  }

  const formatDateTime = (date) => {
    const appointmentDate = new Date(date)

    return (
      appointmentDate.getFullYear() +
      "-" +
      String(appointmentDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(appointmentDate.getDate()).padStart(2, "0") +
      "T" +
      String(appointmentDate.getHours()).padStart(2, "0") +
      ":" +
      String(appointmentDate.getMinutes()).padStart(2, "0")
    )
  }

  const formatAppointmentDate = (date) => {
    return new Date(date).toLocaleString()
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchAppointments = async () => {
      try {
        setLoading(true)
        setError("")

        const token = localStorage.getItem("token")

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/appointments/allAppointments`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        )

        const data = await res.json()

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch appointments"
          )
        }

        setAppointments(data)
      } catch (error) {
        if (error.name === "AbortError") {
          return
        }

        console.error(
          "Failed to fetch appointments:",
          error
        )

        const message =
          error.message || "Failed to fetch appointments"

        setError(message)
        setAppointments([])
        toast.error(message)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchAppointments()

    return () => {
      controller.abort()
    }
  }, [])

  const handleEdit = (appointment) => {
    setEditingId(appointment._id)
    setEditDate(formatDateTime(appointment.date))
    setEditReason(appointment.reason || "")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditDate("")
    setEditReason("")
  }

  const handleUpdate = async (id) => {
    if (!editDate || !editReason.trim()) {
      toast.error("Date and reason are required")
      return
    }

    const selectedDate = new Date(editDate)

    if (Number.isNaN(selectedDate.getTime())) {
      toast.error("Please enter a valid appointment date")
      return
    }

    if (selectedDate <= new Date()) {
      toast.error("Appointment date must be in the future")
      return
    }

    if (editReason.trim().length < 3) {
      toast.error("Reason must be at least 3 characters")
      return
    }

    try {
      setUpdatingId(id)

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/appointments/updateAppointment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            date: editDate,
            reason: editReason.trim()
          })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update appointment"
        )
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === id
            ? {
                ...appointment,
                date: data.appointment.date,
                reason: data.appointment.reason,
                doctor:
                  data.appointment.doctor ||
                  appointment.doctor,
                user:
                  data.appointment.user ||
                  appointment.user
              }
            : appointment
        )
      )

      handleCancelEdit()

      toast.success("Appointment updated successfully")
    } catch (error) {
      console.error(
        "Failed to update appointment:",
        error
      )

      toast.error(
        error.message || "Failed to update appointment"
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(id)

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/appointments/deleteAppointment/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to cancel appointment"
        )
      }

      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (appointment) => appointment._id !== id
        )
      )

      toast.success("Appointment cancelled successfully")
    } catch (error) {
      console.error(
        "Failed to delete appointment:",
        error
      )

      toast.error(
        error.message || "Failed to cancel appointment"
      )
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <section
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f4f9fb" }}
      >
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            style={{ color: "#087f8c" }}
            role="status"
          />

          <p className="text-secondary mb-0">
            Loading appointments...
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="py-5 min-vh-100"
        style={{ backgroundColor: "#f4f9fb" }}
      >
        <div className="container">
          <div
            className="bg-white rounded-4 border shadow-sm text-center p-5 mx-auto"
            style={{
              maxWidth: "700px",
              borderColor: "#e1e9ef"
            }}
          >
            <h2 className="fw-bold text-danger mb-3">
              Failed To Load Appointments
            </h2>

            <p className="text-secondary mb-0">
              {error}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="py-5 min-vh-100"
      style={{ backgroundColor: "#f4f9fb" }}
    >
      <div className="container">
        <div className="text-center mb-5">
          <h1
            className="fw-bold mb-2"
            style={{ color: "#102a43" }}
          >
            Appointments
          </h1>

          <p className="text-secondary mb-0">
            View and manage all patient appointments.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div
            className="bg-white rounded-4 border shadow-sm text-center p-5 mx-auto"
            style={{
              maxWidth: "700px",
              borderColor: "#e1e9ef"
            }}
          >
            <h3
              className="fw-bold mb-3"
              style={{ color: "#102a43" }}
            >
              No Appointments Found
            </h3>

            <p className="text-secondary mb-0">
              There are no appointments available yet.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {appointments.map((appointment) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={appointment._id}
              >
                <div
                  className="bg-white rounded-4 border shadow-sm h-100 overflow-hidden"
                  style={{ borderColor: "#e1e9ef" }}
                >
                  {appointment.doctor?.image && (
                    <div style={{ height: "220px" }}>
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${appointment.doctor.image}`}
                        alt={appointment.doctor.name}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <h2
                      className="h5 fw-bold mb-2"
                      style={{ color: "#102a43" }}
                    >
                      {appointment.doctor?.name ||
                        "Unknown Doctor"}
                    </h2>

                    <p
                      className="fw-semibold mb-4"
                      style={{ color: "#087f8c" }}
                    >
                      {appointment.doctor?.department?.name ||
                        "Unknown Department"}
                    </p>

                    {editingId === appointment._id ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Appointment Date
                          </label>

                          <input
                            type="datetime-local"
                            className="form-control"
                            value={editDate}
                            min={getLocalDateTime()}
                            onChange={(e) =>
                              setEditDate(e.target.value)
                            }
                            disabled={
                              updatingId === appointment._id
                            }
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Reason
                          </label>

                          <textarea
                            className="form-control"
                            rows="3"
                            value={editReason}
                            minLength="3"
                            onChange={(e) =>
                              setEditReason(e.target.value)
                            }
                            disabled={
                              updatingId === appointment._id
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="rounded-3 p-3 mb-3"
                          style={{
                            backgroundColor: "#f4f9fb"
                          }}
                        >
                          <p className="small text-secondary mb-1">
                            Patient
                          </p>

                          <p
                            className="fw-semibold mb-1"
                            style={{ color: "#102a43" }}
                          >
                            {appointment.user?.name ||
                              "Unknown Patient"}
                          </p>

                          {appointment.user?.email && (
                            <p className="small text-secondary mb-0">
                              {appointment.user.email}
                            </p>
                          )}
                        </div>

                        <div
                          className="rounded-3 p-3 mb-3"
                          style={{
                            backgroundColor: "#f4f9fb"
                          }}
                        >
                          <p className="small text-secondary mb-1">
                            Appointment Date
                          </p>

                          <p
                            className="fw-semibold mb-0"
                            style={{ color: "#102a43" }}
                          >
                            {formatAppointmentDate(
                              appointment.date
                            )}
                          </p>
                        </div>

                        <div
                          className="rounded-3 p-3"
                          style={{
                            backgroundColor: "#f4f9fb"
                          }}
                        >
                          <p className="small text-secondary mb-1">
                            Reason
                          </p>

                          <p
                            className="mb-0"
                            style={{ color: "#486581" }}
                          >
                            {appointment.reason}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="px-4 pb-4">
                    {editingId === appointment._id ? (
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn flex-grow-1 fw-semibold text-white"
                          style={{
                            backgroundColor: "#087f8c",
                            borderColor: "#087f8c"
                          }}
                          onClick={() =>
                            handleUpdate(appointment._id)
                          }
                          disabled={
                            updatingId === appointment._id
                          }
                        >
                          {updatingId === appointment._id
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-secondary fw-semibold"
                          onClick={handleCancelEdit}
                          disabled={
                            updatingId === appointment._id
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-warning flex-grow-1 fw-semibold"
                          onClick={() =>
                            handleEdit(appointment)
                          }
                          disabled={
                            deletingId === appointment._id
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger flex-grow-1 fw-semibold"
                          onClick={() =>
                            handleDelete(appointment._id)
                          }
                          disabled={
                            deletingId === appointment._id
                          }
                        >
                          {deletingId === appointment._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Appointments