import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useNavigate, useSearchParams } from "react-router-dom"
import { X } from "lucide-react"


function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isVerified = searchParams.get("email_verified") === "true"
  
  return(
    <div>
    <div className="relative">
      <div className="m-20">
        <p>{t("home")}</p>
      </div>
    </div>
    {isVerified && (
      <div className="fixed inset-0 z-50 w-205 h-110 flex flex-col items-start justify-center border bg-card text-card-foreground shadow-sm rounded-xl gap-8.5 p-12 my-40 mx-auto">
        <X className="size-6 absolute top-4 right-4" onClick={() => navigate("/")} />
        <h2>{t("auth.confirmed.title")}</h2>
        <p>{t("auth.confirmed.message")}.</p>
        <Button className="w-full" onClick={() => navigate("/login")}>
          {t("auth.confirmed.button")}
        </Button>
      </div>
      )}
    </div>
  )
}

export default Home