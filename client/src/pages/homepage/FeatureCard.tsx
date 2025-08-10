// client/src/pages/homepage/FeatureCard.tsx
import { motion, useAnimate } from 'framer-motion'
import { useEffect } from 'react'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const [scope, animate] = useAnimate()

  const handleMouseEnter = () => {
    animate(
      scope.current,
      {
        x: 0,
        scale: 1,
      },
      { duration: 0.2 }
    )
  }

  const handleMouseLeave = () => {
    animate(
      scope.current,
      {
        x: [0, -10, 0],
        scale: [1, 1.1, 1],
      },
      {
        duration: 2,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      }
    )
  }

  useEffect(() => {
    handleMouseLeave()
  }, [])

  return (
    <motion.div
      ref={scope}
      className="p-6 bg-white/80 backdrop-blur rounded shadow hover:scale-105 hover:shadow-xl transition flex flex-col items-center text-gray-900 border hover:border-blue-600"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={icon} alt={title} className="w-32 h-24 mb-6" />
      <h3 className="text-xl font-bold mb-2 text-center min-h-[2.5rem]">{title}</h3>
      <p className="text-center text-base sm:text-lg max-w-sm break-words">{description}</p>
    </motion.div>
  )
}
