import { motion } from 'framer-motion'

export default function About() {
  return (
    <section
      id="about"
      className="min-h-screen px-6 py-32 bg-gray-50 flex items-center justify-center"
    >
      <motion.div
        className="will-change-transform"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-4xl font-bold mb-4">About Me</h2>
        <p className="text-gray-600 text-lg">
          I’m a front-end developer passionate about performance and aesthetics.
        </p>
      </motion.div>
    </section>
  )
}
