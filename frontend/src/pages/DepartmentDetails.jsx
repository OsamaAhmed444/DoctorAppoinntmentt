import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

function DepartmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const setFormData = (departmentData) => {
    setName(departmentData?.name || "")
    setDescription(departmentData?.description || "")
    setImage(null)
    setImagePreview("")
  }

  useEffect(() => {
    const controller = new AbortController()

    const fetchDepartment = async () => {
      try {
        setLoading(true)
        setError("")

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

        const selectedDepartment = data.find(
          (departmentItem) => departmentItem._id === id
        )

        if (!selectedDepartment) {
          setDepartment(null)
          return
        }

        setDepartment(selectedDepartment)
        setFormData(selectedDepartment)
      } catch (error) {
        if (error.name === "AbortError") {
          return
        }

        console.error(
          "Failed to fetch department:",
          error
        )

        setDepartment(null)
        setError(
          error.message || "Failed to fetch department"
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchDepartment()

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

  const handleEdit = () => {
    setIsEditing(true)
    setFormData(department)
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
    setFormData(department)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Department name is required")
      return
    }

    if (name.trim().length < 3) {
      toast.error(
        "Department name must be at least 3 characters"
      )
      return
    }

    if (
      description.trim() &&
      description.trim().length < 3
    ) {
      toast.error(
        "Description must be at least 3 characters"
      )
      return
    }

    try {
      setSaving(true)

      const formData = new FormData()

      formData.append("name", name.trim())
      formData.append("description", description.trim())

      if (image) {
        formData.append("image", image)
      }

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/${id}`,
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
          data.message || "Failed to update department"
        )
      }

      setDepartment(data.department)
      setFormData(data.department)
      setIsEditing(false)

      toast.success("Department updated successfully")
    } catch (error) {
      console.error(
        "Failed to update department:",
        error
      )

      toast.error(
        error.message || "Failed to update department"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/${id}`,
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
          data.message || "Failed to delete department"
        )
      }

      toast.success("Department deleted successfully")
      navigate("/")
    } catch (error) {
      console.error(
        "Failed to delete department:",
        error
      )

      toast.error(
        error.message || "Failed to delete department"
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
            Loading department...
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
          <h2 className="fw-bold text-danger mb-3">
            Failed To Load Department
          </h2>

          <p className="text-secondary mb-4">
            {error}
          </p>

          <Link
            to="/"
            className="btn text-white fw-semibold px-4"
            style={{
              backgroundColor: "#087f8c",
              borderColor: "#087f8c"
            }}
          >
            Back To Home
          </Link>
        </div>
      </section>
    )
  }

  if (!department) {
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
            Department Not Found
          </h2>

          <p className="text-secondary mb-4">
            The department you are looking for does not exist.
          </p>

          <Link
            to="/"
            className="btn text-white fw-semibold px-4"
            style={{
              backgroundColor: "#087f8c",
              borderColor: "#087f8c"
            }}
          >
            Back To Home
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
        {!isEditing && department.image && (
          <div className="text-center mb-4">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${department.image}`}
              alt={department.name}
              className="img-fluid rounded-4 shadow-sm d-block mx-auto"
              style={{
                maxWidth: "600px",
                height: "300px",
                objectFit: "cover"
              }}
            />
          </div>
        )}

        {isEditing ? (
          <div
            className="bg-white rounded-4 border shadow-sm p-4 p-md-5 mx-auto"
            style={{
              maxWidth: "700px",
              borderColor: "#e1e9ef"
            }}
          >
            <div className="text-center mb-4">
              <h1
                className="fw-bold mb-2"
                style={{ color: "#102a43" }}
              >
                Edit Department
              </h1>

              <p className="text-secondary mb-0">
                Update department information.
              </p>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="text-center mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="New department preview"
                    className="img-fluid rounded-4 shadow-sm d-block mx-auto"
                    style={{
                      maxWidth: "600px",
                      height: "300px",
                      objectFit: "cover"
                    }}
                  />
                ) : department.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${department.image}`}
                    alt={department.name}
                    className="img-fluid rounded-4 shadow-sm d-block mx-auto"
                    style={{
                      maxWidth: "600px",
                      height: "300px",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <div
                    className="p-4 rounded-3"
                    style={{
                      backgroundColor: "#f4f9fb"
                    }}
                  >
                    <p className="text-secondary mb-0">
                      No current image.
                    </p>
                  </div>
                )}

                {imagePreview && (
                  <p className="small text-success mt-2 mb-0">
                    New image selected
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Department Name
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
                  disabled={saving}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="departmentImage"
                  className="form-label fw-semibold"
                >
                  Change Image
                </label>

                <input
                  id="departmentImage"
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
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
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
          <div
            className="bg-white rounded-4 border shadow-sm p-4 p-md-5 mx-auto"
            style={{
              maxWidth: "900px",
              borderColor: "#e1e9ef"
            }}
          >
            <div className="text-center">
              <h1
                className="fw-bold mb-3"
                style={{ color: "#102a43" }}
              >
                {department.name}
              </h1>

              <p
                className="text-secondary fs-5 mx-auto mb-0"
                style={{ maxWidth: "700px" }}
              >
                {department.description ||
                  "No description available for this department."}
              </p>
            </div>

            {user?.role === "admin" && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-warning fw-semibold"
                  onClick={handleEdit}
                  disabled={deleting}
                >
                  Edit Department
                </button>

                <button
                  type="button"
                  className="btn btn-danger fw-semibold"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? "Deleting..."
                    : "Delete Department"}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-4">
          <Link
            to="/"
            className="btn btn-outline-secondary fw-semibold px-4"
          >
            Back To Departments
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DepartmentDetails