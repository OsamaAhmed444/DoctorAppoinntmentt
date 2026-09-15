import React from "react"
import { Link } from "react-router-dom"
import {
  CalendarPlus,
  ArrowUpRight
} from "lucide-react"

function CallToAction() {
  return (
    <section
      className="py-5"
      style={{ background: "#f4f9fb" }}
    >
      <div className="container">
        <div
          className="position-relative overflow-hidden p-4 p-md-5"
          style={{
            background:
              "linear-gradient(135deg, #0b7285 0%, #087f8c 55%, #075985 100%)",
            borderRadius: "24px",
            boxShadow: "0 18px 45px rgba(7,89,133,0.16)"
          }}
        >
          <div
            className="position-absolute rounded-circle"
            style={{
              width: "220px",
              height: "220px",
              right: "-80px",
              top: "-100px",
              border: "1px solid rgba(255,255,255,0.15)"
            }}
          />

          <div
            className="position-absolute rounded-circle"
            style={{
              width: "150px",
              height: "150px",
              right: "80px",
              bottom: "-100px",
              border: "1px solid rgba(255,255,255,0.12)"
            }}
          />

          <div className="row align-items-center g-4 position-relative">
            <div className="col-12 col-lg-8">
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#d9f7f8"
                }}
              >
                <CalendarPlus size={17} />
                <small className="fw-semibold">
                  YOUR HEALTH MATTERS
                </small>
              </div>

              <h2 className="fw-bold text-white mb-3">
                Ready to take the next step?
              </h2>

              <p
                className="mb-0"
                style={{
                  color: "#d9edf0",
                  maxWidth: "650px",
                  lineHeight: "1.7"
                }}
              >
                Find the right doctor and schedule an appointment without the
                unnecessary hassle.
              </p>
            </div>

            <div className="col-12 col-lg-4 text-lg-end">
              <Link
                to="/add-appointment"
                className="btn px-4 py-3 fw-semibold d-inline-flex align-items-center gap-2"
                style={{
                  background: "#fff",
                  color: "#087f8c",
                  borderRadius: "11px"
                }}
              >
                Book An Appointment
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction