import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle: string
  imageUrl: string
  minHeight?: string
  buttonText?: string
  buttonLink?: string
}

export default function Hero({ title, subtitle, imageUrl, minHeight = '100vh', buttonText, buttonLink }: HeroProps) {
  return (
    <section
      className="hero"
      style={{
        minHeight,
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imageUrl}')`,
      }}
    >
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {buttonText && buttonLink && <Link href={buttonLink} className="btn btn-primary">{buttonText}</Link>}
      </div>
    </section>
  )
}
