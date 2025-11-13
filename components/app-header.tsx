"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Home, Search, FileText, MessageSquare, FolderOpen, ChevronLeft, Moon, Sun, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/supabase/auth"
import { toast } from "sonner"

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // 현재 사용자 가져오기
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 인증 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.error("로그아웃에 실패했습니다.")
    }
  }

  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/search", label: "신호 검색", icon: Search },
    { href: "/reports", label: "리포트", icon: FolderOpen },
  ]

  const isAnalysisPage = pathname?.startsWith("/analysis/")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 dark:from-indigo-700 dark:via-purple-600 dark:to-indigo-700 backdrop-blur-md supports-[backdrop-filter]:from-indigo-900/95 supports-[backdrop-filter]:via-purple-900/95 supports-[backdrop-filter]:to-indigo-900/95 dark:supports-[backdrop-filter]:from-indigo-700/95 dark:supports-[backdrop-filter]:via-purple-600/95 dark:supports-[backdrop-filter]:to-indigo-700/95 shadow-lg shadow-purple-900/20 dark:shadow-purple-600/40">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="위드인천에너지 로고"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <h1 className="text-lg font-semibold hidden sm:block text-slate-50 dark:text-slate-50">위드인천에너지 ControlLogic AI</h1>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "transition-all duration-200 text-slate-100 dark:text-slate-100 hover:bg-white/10 dark:hover:bg-white/10 hover:scale-105 active:scale-95 active:bg-white/20",
                    isActive && "bg-white/20 dark:bg-white/20 font-semibold shadow-md"
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </Button>
              )
            })}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 text-slate-100 dark:text-slate-100 hover:bg-white/10 dark:hover:bg-white/10 hover:scale-105 active:scale-95 active:bg-white/20 transition-all duration-200"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">테마 전환</span>
            </Button>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2 ml-2">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10">
                      <User className="h-4 w-4 text-slate-100" />
                      <span className="text-sm text-slate-100">{user.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-slate-100 dark:text-slate-100 hover:bg-white/10 dark:hover:bg-white/10 hover:scale-105 active:scale-95 active:bg-white/20 transition-all duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="hidden md:inline">로그아웃</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    className="ml-2 bg-white/20 hover:bg-white/30 active:bg-white/40 text-slate-100 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <Link href="/login">
                      <User className="h-4 w-4 mr-2" />
                      로그인
                    </Link>
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
