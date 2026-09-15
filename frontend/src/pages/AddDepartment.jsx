import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify"

function AddDepartment() {
  const { user } = useContext(AuthContext)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

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

    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (user?.role !== "admin") {
      toast.error("Access denied. Admin only.")
      return
    }

    if (!name.trim()) {
      toast.error("Department name is required")
      return
    }

    if (name.trim().length < 3) {
      toast.error("Department name must be at least 3 characters")
      return
    }

    if (
      description.trim() &&
      description.trim().length < 3
    ) {
      toast.error("Description must be at least 3 characters")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append("name", name.trim())
      formData.append("description", description.trim())

      if (image) {
        formData.append("image", image)
      }

      const token = localStorage.getItem("token")

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/addDepartments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add department"
        )
      }

      toast.success("Department added successfully")

      setName("")
      setDescription("")
      setImage(null)
      setImagePreview(null)
    } catch (error) {
      console.error("Failed to add department:", error)

      toast.error(
        error.message || "Something went wrong"
      )
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== "admin") {
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
                  Add Department
                </h1>

                <p className="text-secondary mb-0">
                  Create a new medical department.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Department Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter department name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    minLength="3"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Enter department description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    minLength="3"
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Department Image
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                </div>

                {imagePreview && (
                  <div className="mb-4">
                    <div
                      className="rounded-4 overflow-hidden border"
                      style={{
                        height: "240px",
                        borderColor: "#e1e9ef"
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Department preview"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                )}

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
                    ? "Adding Department..."
                    : "Add Department"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddDepartment