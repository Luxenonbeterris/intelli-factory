import About from '../sections/About'
import Contact from '../sections/Contact'
import Hero from '../sections/Hero'
import Projects from '../sections/Projects'

function Home() {
  return (
    <main className="bg-white text-gray-900">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
  )
}
export default Home
