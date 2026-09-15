import { createContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      return
    }

    try {
      const decoded = jwtDecode(token)
      setUser(decoded)
    } catch {
      localStorage.removeItem("token")
      setUser(null)
    }
  }, [])

  const login = (token) => {
    try {
      const decoded = jwtDecode(token)

      localStorage.setItem("token", token)
      setUser(decoded)
    } catch {
      localStorage.removeItem("token")
      setUser(null)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
