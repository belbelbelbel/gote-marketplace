"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Buyer",
    content:
      "Fast delivery is clear. The website is easy to navigate and the customer service is outstanding. I've been shopping here for months and never had any issues.",
    rating: 5,
    avatar: "/professional-woman-smiling.png",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Small Business Owner",
    content:
      "I've been selling on GOTE for over a year now. The platform is user-friendly and the AI support system helps resolve customer issues quickly. Great for growing my business!",
    rating: 5,
    avatar: "/asian-businessman-smiling.png",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Frequent Shopper",
    content:
      "The website is sleek and modern. I love how easy it is to find exactly what I'm looking for. The AI chat feature is incredibly helpful when I have questions.",
    rating: 5,
    avatar: "/latina-woman-smiling.png",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Tech Enthusiast",
    content:
      "GOTE has the best selection of electronics I've found online. The vendor ratings and reviews help me make informed decisions. Highly recommend!",
    rating: 5,
    avatar: "/smiling-man-glasses.png",
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Fashion Lover",
    content:
      "Amazing variety of fashion items from different sellers. The quality is always as described and shipping is super fast. My go-to shopping destination!",
    rating: 5,
    avatar: "/stylish-woman-smiling.png",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Home Decorator",
    content:
      "Found the perfect furniture and decor items for my home renovation. The search filters make it easy to find exactly what I need. Excellent marketplace!",
    rating: 5,
    avatar: "/middle-aged-man-smiling.png",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-balance mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Trusted by shoppers worldwide. Here's what our community has to say about their GOTE experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                <blockquote className="text-muted-foreground mb-4 text-pretty">"{testimonial.content}"</blockquote>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-lg font-semibold">4.9/5</span>
            <span>from over 10,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}
