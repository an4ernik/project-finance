import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Header() {
  const { t } = useTranslation();
  
  return(
    <div className="">
      <ul className="flex flex-row justify-center gap-6">
        <li>
          <Link className="text-xl font-bold cursor-pointer" to="/signup">
            {t("signUp")}
          </Link>
        </li>
        <li>
          <Link className="text-xl font-bold cursor-pointer" to="/login">
          {t("logIn")}
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Header