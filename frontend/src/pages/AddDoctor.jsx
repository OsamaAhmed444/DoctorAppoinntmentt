import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

function AddDoctor() {
  const { user } = useContext(AuthContext)

  const [preview, setPreview] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [departments, setDepartments] = useState([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [departmentError, setDepartmentError] = useState("")

  const [form, setForm] = useState({
    name: "",
    department: "",
    experienceYears: "",
    description: "",
    image: null
  })

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
          throw new Error(
            data.message || "Failed to fetch departments"
          )
        }

        setDepartments(data)
      } catch (error) {
        console.error(
          "Failed to fetch departments:",
          error
        )

        setDepartmentError(
          error.message || "Failed to fetch departments"
        )
      } finally {
        setLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [])

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (files) {
      const file = files[0]

      if (!file) {
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        e.target.value = ""
        return
      }

      setForm((prev) => ({
        ...prev,
        image: file
      }))

      setPreview(URL.createObjectURL(file))
      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (
      !form.name.trim() ||
      !form.department ||
      !form.experienceYears ||
      !form.description.trim()
    ) {
      const message =
        "Please fill in all required fields"

      setError(message)
      toast.error(message)
      return
    }

    if (form.name.trim().length < 3) {
      const message =
        "Doctor name must be at least 3 characters"

      setError(message)
      toast.error(message)
      return
    }

    const experienceYears = Number(
      form.experienceYears
    )

    if (
      Number.isNaN(experienceYears) ||
      !Number.isInteger(experienceYears) ||
      experienceYears < 0
    ) {
      const message =
        "Experience years must be a valid whole number greater than or equal to 0"

      setError(message)
      toast.error(message)
      return
    }

    if (form.description.trim().length < 3) {
      const message =
        "Description must be at least 3 characters"

      setError(message)
      toast.error(message)
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem("token")
      const formData = new FormData()

      formData.append(
        "name",
        form.name.trim()
      )

      formData.append(
        "department",
        form.department
      )

      formData.append(
        "experienceYears",
        experienceYears
      )

      formData.append(
        "description",
        form.description.trim()
      )

      if (form.image) {
        formData.append(
          "image",
          form.image
        )
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/doctors/addDoctors`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to add doctor"
        )
      }

      toast.success(
        "Doctor added successfully!"
      )

      setForm({
        name: "",
        department: "",
        experienceYears: "",
        description: "",
        image: null
      })

      setPreview(null)
    } catch (error) {
      console.error(
        "Error submitting form:",
        error
      )

      setError(
        error.message || "Something went wrong"
      )

      toast.error(
        error.message || "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <section
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{ backgroundColor: "#f4f9fb" }}
      >
        <div
          className="bg-white rounded-4 shadow-sm border p-5 text-center"
          style={{ maxWidth: "500px" }}
        >
          <h3
            className="fw-bold mb-3"
            style={{ color: "#102a43" }}
          >
            Access Denied
          </h3>

          <p className="text-secondary mb-0">
            You must be an admin to access this page.
          </p>
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
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div
              className="bg-white rounded-4 border shadow-sm p-4 p-md-5"
              style={{ borderColor: "#e1e9ef" }}
            >
              <div className="text-center mb-4">
                <h1
                  className="fw-bold mb-2"
                  style={{ color: "#102a43" }}
                >
                  Add Doctor
                </h1>

                <p className="text-secondary mb-0">
                  Create a new doctor profile.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4 text-center">
                  <div
                    className="rounded-circle overflow-hidden border mx-auto mb-3"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderColor: "#e1e9ef",
                      backgroundColor: "#f4f9fb"
                    }}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Doctor preview"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                          backgroundColor: "#eef5f7",
                          color: "#087f8c"
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="70"
                          height="70"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21a8 8 0 0 0-16 0" />
                          <circle
                            cx="12"
                            cy="7"
                            r="4"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="fileInput"
                    className={`btn px-4 fw-semibold ${
                      loading
                        ? "btn-secondary"
                        : "btn-outline-primary"
                    }`}
                  >
                    Choose Image
                  </label>

                  <input
                    id="fileInput"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <div className="small text-secondary mt-2">
                    Image is optional
                  </div>
                </div>

                {error && (
                  <div
                    className="alert alert-danger rounded-3"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {departmentError && (
                  <div
                    className="alert alert-warning rounded-3"
                    role="alert"
                  >
                    {departmentError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Doctor Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter doctor's full name"
                    value={form.name}
                    onChange={handleChange}
                    minLength="3"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Department
                  </label>

                  <select
                    name="department"
                    className="form-select"
                    value={form.department}
                    onChange={handleChange}
                    required
                    disabled={
                      loading ||
                      loadingDepartments ||
                      departments.length === 0
                    }
                  >
                    <option value="">
                      {loadingDepartments
                        ? "Loading departments..."
                        : departments.length === 0
                          ? "No departments available"
                          : "Select department"}
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
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Experience Years
                  </label>

                  <input
                    type="number"
                    name="experienceYears"
                    className="form-control"
                    placeholder="Enter years of experience"
                    value={form.experienceYears}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="5"
                    placeholder="Enter doctor's professional description"
                    value={form.description}
                    onChange={handleChange}
                    minLength="3"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 py-2 fw-semibold text-white"
                  style={{
                    backgroundColor: "#087f8c",
                    borderColor: "#087f8c"
                  }}
                  disabled={loading}
                >
                  {loading
                    ? "Adding Doctor..."
                    : "Add Doctor"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddDoctor