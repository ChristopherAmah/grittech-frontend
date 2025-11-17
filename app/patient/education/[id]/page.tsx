"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import { getArticleById } from "@/lib/education"
import { Heart, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

export default function ArticlePage() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "patient") {
      router.push("/auth/login")
      return
    }

    setUser(currentUser)

    const articleId = params.id as string
    const foundArticle = getArticleById(articleId)

    if (!foundArticle) {
      router.push("/patient/education")
      return
    }

    setArticle(foundArticle)
  }, [router, params.id])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      pregnancy: "bg-purple-100 text-purple-800",
      nursing: "bg-pink-100 text-pink-800",
      nutrition: "bg-green-100 text-green-800",
      "mental-health": "bg-blue-100 text-blue-800",
      exercise: "bg-orange-100 text-orange-800",
      general: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.general
  }

  if (!user || !article) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-semibold">MaternalCare</span>
          </div>

          <Button variant="ghost" asChild>
            <Link href="/patient/education">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Library
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-4 py-8 max-w-4xl">
        <Card>
          <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-lg flex items-center justify-center">
            <img
              src={`/.jpg?height=300&width=800&query=${article.imageQuery}`}
              alt={article.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>

          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </div>
            </div>
            <CardTitle className="text-3xl">{article.title}</CardTitle>
            <p className="text-muted-foreground mt-2">{article.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-2">{children}</h4>,
                  p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="text-foreground">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
