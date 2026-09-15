import React, { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import {
  ArrowRight,
  ShieldCheck,
  Clock3,
  Stethoscope
} from "lucide-react"
import carousel_1 from "../img/hero-carousel/hero-carousel-1.jpg"
import carousel_2 from "../img/hero-carousel/hero-carousel-2.jpg"
import carousel_3 from "../img/hero-carousel/hero-carousel-3.jpg"

function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 35
  })

  const [selectedIndex, setSelectedIndex] = useState(0)

  const slides = [
    {
      image: carousel_1,
      eyebrow: "PERSONALIZED HEALTHCARE",
      title: "Better care starts with the right doctor.",
      text: "Connect with experienced medical professionals and manage your healthcare journey through one simple platform."
    },
    {
      image: carousel_2,
      eyebrow: "SPECIALIZED CARE",
      title: "Expert teams for every stage of your health.",
      text: "Explore specialized departments and discover doctors with the experience you need."
    },
    {
      image: carousel_3,
      eyebrow: "SIMPLE APPOINTMENTS",
      title: "Book your next appointment in minutes.",
      text: "Find a doctor, choose a convenient date, and keep your appointments organized."
    }
  ]

  const scrollTo = useCallback(
    (index) => {
      if (!emblaApi) return

      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    onSelect()
    emblaApi.on("select", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const autoplay = setInterval(() => {
      emblaApi.scrollNext()
    }, 5500)

    return () => {
      clearInterval(autoplay)
    }
  }, [emblaApi])

  return (
    <section
      className="position-relative overflow-hidden"
      style={{ background: "#f4f9fb" }}
    >
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((slide, index) => (
              <div
                className={`embla__slide ${
                  selectedIndex === index ? "is-selected" : ""
                }`}
                key={index}
              >
                <div
                  className="position-relative"
                  style={{ minHeight: "680px" }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />

                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(8,31,49,0.94) 0%, rgba(8,31,49,0.78) 42%, rgba(8,31,49,0.18) 100%)"
                    }}
                  />

                  <div
                    className="container position-relative h-100"
                    style={{ minHeight: "680px" }}
                  >
                    <div
                      className="row align-items-center h-100"
                      style={{ minHeight: "680px" }}
                    >
                      <div className="col-12 col-lg-7">
                        <div
                          className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
                          style={{
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            color: "#b7ecee"
                          }}
                        >
                          <Stethoscope size={16} />

                          <span
                            className="small fw-semibold"
                            style={{ letterSpacing: "0.08em" }}
                          >
                            {slide.eyebrow}
                          </span>
                        </div>

                        <h1
                          className="fw-bold text-white mb-4"
                          style={{
                            fontSize: "clamp(2.6rem, 5vw, 4.8rem)",
                            lineHeight: "1.05",
                            maxWidth: "760px"
                          }}
                        >
                          {slide.title}
                        </h1>

                        <p
                          className="mb-4"
                          style={{
                            color: "#d9e8ef",
                            fontSize: "1.08rem",
                            lineHeight: "1.8",
                            maxWidth: "650px"
                          }}
                        >
                          {slide.text}
                        </p>

                        <div className="d-flex flex-wrap gap-3">
                          <a
                            href="/#doctors"
                            className="btn px-4 py-3 fw-semibold d-inline-flex align-items-center gap-2"
                            style={{
                              background: "#36c2c7",
                              color: "#062b35",
                              borderRadius: "11px"
                            }}
                          >
                            Explore Doctors
                            <ArrowRight size={18} />
                          </a>

                          <a
                            href="/#about"
                            className="btn px-4 py-3 fw-semibold"
                            style={{
                              color: "#fff",
                              border: "1px solid rgba(255,255,255,0.35)",
                              borderRadius: "11px",
                              background: "rgba(255,255,255,0.08)"
                            }}
                          >
                            Learn More
                          </a>
                        </div>

                        <div className="d-flex flex-wrap gap-4 mt-5">
                          <div
                            className="d-flex align-items-center gap-2"
                            style={{ color: "#d9e8ef" }}
                          >
                            <ShieldCheck size={19} />
                            <small>Trusted care</small>
                          </div>

                          <div
                            className="d-flex align-items-center gap-2"
                            style={{ color: "#d9e8ef" }}
                          >
                            <Clock3 size={19} />
                            <small>Easy booking</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="embla__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              className={`embla__dot ${
                selectedIndex === index ? "is-active" : ""
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSlider