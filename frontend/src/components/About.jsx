import React from "react"
import {
  Play,
  CheckCircle2,
  HeartPulse,
  UsersRound,
  ShieldCheck
} from "lucide-react"
import AboutUs from "../img/about.jpg"

function About() {
  return (
    <section
      id="about"
      className="py-5"
      style={{ background: "#fff" }}
    >
      <div className="container py-lg-4">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6">
            <div className="position-relative pe-lg-4">
              <img
                src={AboutUs}
                alt="Healthcare professionals"
                className="w-100"
                style={{
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "24px"
                }}
              />

              <div
                className="position-absolute bg-white p-3 p-md-4"
                style={{
                  left: "-10px",
                  bottom: "25px",
                  borderRadius: "16px",
                  boxShadow: "0 15px 40px rgba(16,42,67,0.14)",
                  maxWidth: "270px"
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "#e8f7f7"
                    }}
                  >
                    <HeartPulse size={22} style={{ color: "#087f8c" }} />
                  </div>

                  <div>
                    <strong
                      className="d-block"
                      style={{ color: "#102a43" }}
                    >
                      Patient-first care
                    </strong>

                    <small className="text-secondary">
                      Built around your needs
                    </small>
                  </div>
                </div>
              </div>

              <a
                href="https://www.youtube.com/watch?v=0XX9K8ZqOSg"
                target="_blank"
                rel="noreferrer"
                className="position-absolute top-50 start-50 translate-middle text-decoration-none"
                aria-label="Watch patient-centered care video"
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "76px",
                    height: "76px",
                    background: "#087f8c",
                    color: "#fff",
                    boxShadow: "0 10px 30px rgba(8,127,140,0.35)"
                  }}
                >
                  <Play size={27} fill="currentColor" />
                </div>
              </a>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <span
              className="fw-bold small"
              style={{
                color: "#087f8c",
                letterSpacing: "0.12em"
              }}
            >
              ABOUT MEDICARE
            </span>

            <h2
              className="fw-bold mt-3 mb-4"
              style={{
                color: "#102a43",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                lineHeight: "1.15"
              }}
            >
              Healthcare designed around people.
            </h2>

            <p className="text-secondary" style={{ lineHeight: "1.8" }}>
              We bring patients and healthcare professionals together through
              a simple, reliable platform designed to make finding care and
              managing appointments easier.
            </p>

            <p className="text-secondary" style={{ lineHeight: "1.8" }}>
              From discovering specialized departments to booking
              appointments, every part of the experience is built with
              clarity and convenience in mind.
            </p>

            <div className="row g-3 mt-3">
              <div className="col-12 col-sm-6">
                <div className="d-flex gap-3">
                  <CheckCircle2
                    size={21}
                    style={{ color: "#087f8c", flexShrink: 0 }}
                  />
                  <span>Easy online appointment booking</span>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="d-flex gap-3">
                  <UsersRound
                    size={21}
                    style={{ color: "#087f8c", flexShrink: 0 }}
                  />
                  <span>Experienced medical professionals</span>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="d-flex gap-3">
                  <ShieldCheck
                    size={21}
                    style={{ color: "#087f8c", flexShrink: 0 }}
                  />
                  <span>Reliable and organized care</span>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="d-flex gap-3">
                  <HeartPulse
                    size={21}
                    style={{ color: "#087f8c", flexShrink: 0 }}
                  />
                  <span>Patient-focused experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About