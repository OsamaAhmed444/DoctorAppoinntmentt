import React from "react"
import HeroSlider from "../components/HeroSlider"
import CallToAction from "../components/CallToAction"
import About from "../components/About"
import Stats from "../components/Stats"
import Departments from "../components/Departments"
import Doctors from "../components/Doctors"

function Home() {
  return (
    <>
      <HeroSlider />
      <CallToAction />
      <About />
      <Stats />
      <Departments />
      <Doctors />
    </>
  )
}

export default Home