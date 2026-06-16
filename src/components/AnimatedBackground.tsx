"use client"
export default function AnimatedBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      <div style={{
        position: 'absolute',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
        opacity: 0.25,
        top: '-200px',
        left: '-200px',
        animationName: 'orbFloat1',
        animationDuration: '20s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite'
      }}/>

      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
        opacity: 0.18,
        top: '-100px',
        right: '-150px',
        animationName: 'orbFloat2',
        animationDuration: '25s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite'
      }}/>

      <div style={{
        position: 'absolute',
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
        opacity: 0.15,
        bottom: '-300px',
        left: '30%',
        animationName: 'orbFloat3',
        animationDuration: '30s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite'
      }}/>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(124,58,237,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.4) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        opacity: 0.06,
        animationName: 'gridMove',
        animationDuration: '8s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite'
      }}/>

      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #7c3aed, #a855f7, #3b82f6, transparent)',
        backgroundSize: '200% 100%',
        opacity: 0.7,
        animationName: 'shimmerBg',
        animationDuration: '3s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite'
      }}/>
    </div>
  )
}
