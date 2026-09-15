import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

function DoctorDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [doctor, setDoctor] = useState(null)
  const [relatedDoctors, setRelatedDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")
  const [experienceYears, setExperienceYears] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [departments, setDepartments] = useState([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [departmentError, setDepartmentError] = useState("")

  const getDepartmentId = (doctorData) =>
    doctorData?.department?._id ||
    doctorData?.department ||
    ""

  const resetForm = (doctorData) => {
    setName(doctorData?.name || "")
    setDepartment(getDepartmentId(doctorData))
    setExperienceYears(
      doctorData?.experienceYears ?? ""
    )
    setDescription(doctorData?.description || "")
    setImage(null)
    setImagePreview("")
  }

  const fetchDepartments = async (signal) => {
    try {
      setLoadingDepartments(true)
      setDepartmentError("")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/allDepartments`,
        { signal }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch departments"
        )
      }

      setDepartments(data)
    } catch (error) {
      if (error.name === "AbortError") {
        return
      }

      console.error(
        "Failed to fetch departments:",
        error
      )

      setDepartmentError(
        error.message || "Failed to fetch departments"
      )
    } finally {
      if (!signal.aborted) {
        setLoadingDepartments(false)
      }
    }
  }

  const fetchRelatedDoctors = async (
    departmentId,
    currentId,
    signal
  ) => {
    if (!departmentId) {
      setRelatedDoctors([])
      return
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/doctors/byDepartment/${departmentId}`,
        { signal }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to fetch related doctors"
        )
      }

      setRelatedDoctors(
        data.filter((doc) => doc._id !== currentId)
      )
    } catch (error) {
      if (error.name === "AbortError") {
        return
      }

      console.error(
        "Failed to fetch related doctors:",
        error
      )

      setRelatedDoctors([])
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchDoctor = async () => {
      try {
        setLoading(true)
        setError("")

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/doctors/${id}`,
          {
            signal: controller.signal
          }
        )

        const data = await res.json()

        if (!res.ok) {
          if (res.status === 404) {
            setDoctor(null)
            return
          }

          throw new Error(
            data.message || "Failed to fetch doctor"
          )
        }

        setDoctor(data)
        resetForm(data)

        const departmentId = getDepartmentId(data)

        await fetchRelatedDoctors(
          departmentId,
          data._id,
          controller.signal
        )
      } catch (error) {
        if (error.name === "AbortError") {
          return
        }

        console.error(
          "Failed to fetch doctor:",
          error
        )

        setError(
          error.message || "Failed to fetch doctor"
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchDoctor()

    return () => {
      controller.abort()
    }
  }, [id])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleEdit = async () => {
    setIsEditing(true)
    setImage(null)
    setImagePreview("")

    const controller = new AbortController()

    await fetchDepartments(controller.signal)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      e.target.value = ""
      return
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    resetForm(doctor)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Doctor name is required")
      return
    }

    if (name.trim().length < 3) {
      toast.error(
        "Doctor name must be at least 3 characters"
      )
      return
    }

    if (!department) {
      toast.error("Please select a department")
      return
    }

    const parsedExperienceYears = Number(experienceYears)

    if (
      Number.isNaN(parsedExperienceYears) ||
      !Number.isInteger(parsedExperienceYears) ||
      parsedExperienceYears < 0
    ) {
      toast.error(
        "Experience years must be a valid whole number greater than or equal to 0"
      )
      return
    }

    if (!description.trim()) {
      toast.error("Description is required")
      return
    }

    if (description.trim().length < 3) {
      toast.error(
        "Description must be at least 3 characters"
      )
      return
    }

    try {
      setSaving(true)

      const formData = new FormData()

      formData.append("name", name.trim())
      formData.append("department", department)
      formData.append(
        "experienceYears",
        parsedExperienceYears
      )
      formData.append(
        "description",
        description.trim()
      )

      if (image) {
        formData.append("image", image)
      }

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/doctors/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to update doctor"
        )
      }

      setDoctor(data.doctor)
      resetForm(data.doctor)
      setIsEditing(false)

      await fetchRelatedDoctors(
        getDepartmentId(data.doctor),
        data.doctor._id
      )

      toast.success("Doctor updated successfully")
    } catch (error) {
      console.error(
        "Failed to update doctor:",
        error
      )

      toast.error(
        error.message || "Failed to update doctor"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/doctors/${id}`,
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
          data.message || "Failed to delete doctor"
        )
      }

      toast.success("Doctor deleted successfully")
      navigate("/allDoctors")
    } catch (error) {
      console.error(
        "Failed to delete doctor:",
        error
      )

      toast.error(
        error.message || "Failed to delete doctor"
      )
    } finally {
      setDeleting(false)
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
            Loading doctor...
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f4f9fb" }}
      >
        <div
          className="bg-white rounded-4 border shadow-sm p-5 text-center"
          style={{
            maxWidth: "600px",
            borderColor: "#e1e9ef"
          }}
        >
          <h3 className="text-danger mb-3">
            Failed To Load Doctor
          </h3>

          <p className="text-secondary mb-4">
            {error}
          </p>

          <Link
            to="/allDoctors"
            className="btn text-white fw-semibold px-4"
            style={{
              backgroundColor: "#087f8c",
              borderColor: "#087f8c"
            }}
          >
            Back To Doctors
          </Link>
        </div>
      </section>
    )
  }

  if (!doctor) {
    return (
      <section
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f4f9fb" }}
      >
        <div
          className="bg-white rounded-4 border shadow-sm p-5 text-center"
          style={{
            maxWidth: "600px",
            borderColor: "#e1e9ef"
          }}
        >
          <h2
            className="fw-bold mb-3"
            style={{ color: "#102a43" }}
          >
            Doctor Not Found
          </h2>

          <p className="text-secondary mb-4">
            The doctor you are looking for does not exist.
          </p>

          <Link
            to="/allDoctors"
            className="btn text-white fw-semibold px-4"
            style={{
              backgroundColor: "#087f8c",
              borderColor: "#087f8c"
            }}
          >
            Back To Doctors
          </Link>
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
        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-8">
            <div
              className="bg-white rounded-4 border shadow-sm overflow-hidden"
              style={{ borderColor: "#e1e9ef" }}
            >
              {isEditing ? (
                <div className="p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h1
                      className="fw-bold mb-2"
                      style={{ color: "#102a43" }}
                    >
                      Edit Doctor
                    </h1>

                    <p className="text-secondary mb-0">
                      Update doctor information.
                    </p>
                  </div>

                  <div className="text-center mb-4">
                    <div
                      className="rounded-4 overflow-hidden border mx-auto"
                      style={{
                        width: "200px",
                        height: "220px",
                        borderColor: "#e1e9ef"
                      }}
                    >
                      <img
                        src={
                          imagePreview ||
                          `${import.meta.env.VITE_API_URL}/uploads/${doctor.image}`
                        }
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        alt="Doctor preview"
                      />
                    </div>

                    {imagePreview && (
                      <p className="small text-success mt-2 mb-0">
                        New image selected
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        minLength="3"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Department
                      </label>

                      {loadingDepartments ? (
                        <div
                          className="p-3 rounded-3"
                          style={{
                            backgroundColor: "#f4f9fb"
                          }}
                        >
                          <span className="text-secondary">
                            Loading departments...
                          </span>
                        </div>
                      ) : departmentError ? (
                        <div className="alert alert-danger mb-0">
                          {departmentError}
                        </div>
                      ) : departments.length === 0 ? (
                        <div
                          className="p-3 rounded-3"
                          style={{
                            backgroundColor: "#f4f9fb"
                          }}
                        >
                          <span className="text-secondary">
                            No departments available.
                          </span>
                        </div>
                      ) : (
                        <select
                          value={department}
                          onChange={(e) =>
                            setDepartment(e.target.value)
                          }
                          className="form-select"
                          required
                          disabled={saving}
                        >
                          <option value="">
                            Select department
                          </option>

                          {departments.map((item) => (
                            <option
                              key={item._id}
                              value={item._id}
                            >
                              {item.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Experience Years
                      </label>

                      <input
                        type="number"
                        className="form-control"
                        value={experienceYears}
                        onChange={(e) =>
                          setExperienceYears(
                            e.target.value
                          )
                        }
                        min="0"
                        step="1"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Description
                      </label>

                      <textarea
                        className="form-control"
                        rows="5"
                        value={description}
                        onChange={(e) =>
                          setDescription(e.target.value)
                        }
                        minLength="3"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="doctorImage"
                        className="form-label fw-semibold"
                      >
                        Change Image
                      </label>

                      <input
                        id="doctorImage"
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={saving}
                      />

                      <small className="text-secondary">
                        Leave empty to keep the current image.
                      </small>
                    </div>

                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <button
                        type="submit"
                        className="btn flex-grow-1 fw-semibold text-white"
                        style={{
                          backgroundColor: "#087f8c",
                          borderColor: "#087f8c"
                        }}
                        disabled={
                          saving ||
                          loadingDepartments ||
                          !!departmentError ||
                          departments.length === 0
                        }
                      >
                        {saving
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-secondary flex-grow-1 fw-semibold"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-4 p-md-5">
                  <div className="row align-items-center g-4">
                    <div className="col-12 col-md-5 text-center">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${doctor.image}`}
                        className="rounded-4 border shadow-sm"
                        width="260"
                        height="300"
                        style={{ objectFit: "cover" }}
                        alt={doctor.name}
                      />
                    </div>

                    <div className="col-12 col-md-7">
                      <h1
                        className="display-6 fw-bold mb-3"
                        style={{ color: "#102a43" }}
                      >
                        {doctor.name}
                      </h1>

                      <p
                        className="fw-semibold fs-5 mb-2"
                        style={{ color: "#087f8c" }}
                      >
                        {doctor.department?.name ||
                          "No Department"}
                      </p>

                      <p className="text-secondary mb-4">
                        {doctor.experienceYears} Year
                        {doctor.experienceYears !== 1
                          ? "s"
                          : ""}{" "}
                        of Experience
                      </p>

                      <p className="text-secondary mb-0">
                        {doctor.description}
                      </p>
                    </div>
                  </div>

                  {user?.role === "admin" && (
                    <div className="d-flex flex-wrap gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-warning fw-semibold"
                        onClick={handleEdit}
                        disabled={deleting}
                      >
                        Edit Doctor
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger fw-semibold"
                        onClick={handleDelete}
                        disabled={deleting}
                      >
                        {deleting
                          ? "Deleting..."
                          : "Delete Doctor"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div
              className="bg-white rounded-4 border shadow-sm p-4"
              style={{ borderColor: "#e1e9ef" }}
            >
              <h2
                className="h4 fw-bold mb-4"
                style={{ color: "#102a43" }}
              >
                Other{" "}
                {doctor.department?.name || "Department"}{" "}
                Doctors
              </h2>

              <div className="d-flex flex-column gap-3">
                {relatedDoctors.length > 0 ? (
                  relatedDoctors.map((doc) => (
                    <Link
                      key={doc._id}
                      to={`/doctor/${doc._id}`}
                      className="d-flex align-items-center rounded-3 p-3 text-decoration-none border"
                      style={{
                        borderColor: "#edf2f5",
                        color: "#102a43"
                      }}
                    >
                      <img
                        className="rounded-circle object-fit-cover border me-3 flex-shrink-0"
                        src={`${import.meta.env.VITE_API_URL}/uploads/${doc.image}`}
                        width="64"
                        height="64"
                        alt={doc.name}
                      />

                      <div>
                        <h3 className="h6 fw-bold mb-1">
                          {doc.name}
                        </h3>

                        <p className="small text-secondary mb-0">
                          Experience:{" "}
                          {doc.experienceYears} years
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-secondary mb-0">
                    No related doctors found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/allDoctors"
            className="btn btn-outline-secondary fw-semibold px-4"
          >
            Back To Doctors
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DoctorDetails