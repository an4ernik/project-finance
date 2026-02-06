import { Button } from "@/components/ui/button"
import { changeLanguage } from "i18next"
import { useTranslation } from "react-i18next"


function Home() {
  const { i18n, t } = useTranslation()
  function handleLanguage(){
    const newLang = i18n.language === "ua" ? "en" : "ua"
    i18n.changeLanguage(newLang)
  }
  
  
  return(
    <div className="m-20">
      <p>{t("home")}</p>
      <Button className="cursor-pointer" onClick={handleLanguage}>{t("changeLang")}</Button>
    </div>
  )
}

export default Home