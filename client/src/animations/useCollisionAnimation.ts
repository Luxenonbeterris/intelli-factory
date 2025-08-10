// client/src/animations/useCollisionAnimation.ts
import { cubicBezier, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

const customEase = cubicBezier(0.43, 0.13, 0.23, 0.96) // мягкий кастомный cubic bezier

export function useCollisionAnimation() {
  const leftControls = useAnimation()
  const centerControls = useAnimation()
  const rightControls = useAnimation()
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function sequence() {
      // Устанавливаем изначальные позиции без анимации
      await Promise.all([
        leftControls.set({ x: -10 }),
        centerControls.set({ x: 0, scale: 1 }),
        rightControls.set({ x: 10 }),
      ])

      while (isMounted) {
        if (isPaused) {
          await new Promise((r) => setTimeout(r, 100))
          continue
        }

        // Левый и правый идут к центру с кастомным easing и долгой длительностью для плавности
        await Promise.all([
          leftControls.start({ x: 0, transition: { duration: 1, ease: customEase } }),
          rightControls.start({ x: 0, transition: { duration: 1, ease: customEase } }),
        ])

        // Центр плавно подпрыгивает
        await centerControls.start({ scale: 1.1, transition: { duration: 0.25, ease: customEase } })
        await centerControls.start({ scale: 1, transition: { duration: 0.25, ease: customEase } })

        // Возврат в начальные позиции с ускорением, но все еще плавно
        await Promise.all([
          leftControls.start({ x: -10, transition: { duration: 0.5, ease: customEase } }),
          rightControls.start({ x: 10, transition: { duration: 0.5, ease: customEase } }),
        ])

        // Небольшая пауза перед повторением
        await new Promise((r) => setTimeout(r, 0))
      }
    }

    sequence()

    return () => {
      isMounted = false
    }
  }, [leftControls, centerControls, rightControls, isPaused])

  return { leftControls, centerControls, rightControls, setIsPaused }
}
