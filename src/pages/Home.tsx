import { Button } from "@/components/ui/button"
import { changeLanguage } from "i18next"
import { useTranslation } from "react-i18next"


function Home() {
  const { i18n, t } = useTranslation()
  
  return(
    <div className="m-20">
      <p>{t("home")}</p>
    </div>
  )
}

export default Home