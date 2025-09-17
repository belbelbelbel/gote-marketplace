import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br  h-[47rem] flex items-center from-background via-muted/50 to-background py-16 md:py-24" style={{
      backgroundImage: `url('/hero-img.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="inset-0 bg-black opacity-80  z-10 absolute"></div>
      <div className="container mx-auto text-white z-40 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight  text-balance sm:text-5xl md:text-6xl">
            Uncover Unique Products and <span className="text-accent">Unbeatable Prices</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white text-muted-foreground text-pretty">
            Explore our collection of top-quality items, curated just for you. Shop from trusted vendors with our
            AI-powered customer service protecting every purchase.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/become-seller">Become a Seller</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
