import { useTranslation } from "react-i18next"


function Home() {
  const { t } = useTranslation()
  
  return(
    <div className="m-20">
      <p>{t("home")}</p>
    </div>
  )
}

export default Home