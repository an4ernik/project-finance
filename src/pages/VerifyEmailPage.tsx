import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVerifyToken } from '@/shared/api/generated/authentication/authentication'
import { toast } from 'sonner'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import {useAuthStore} from '@/shared/store/useAuthStore'

function VerifyEmailPage() {
  const { t } = useTranslation()
  const setAuth = useAuthStore(state => state.setAuth)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  useEffect(() => {
    if (!token) {
      toast.error(t("auth.verify.tokenDoesntExist"))
      navigate('/login', { replace: true })
      return
    }
  }, [token, navigate])

  const { data, error, isLoading } = useVerifyToken(
    { token },
    {
      query: {
        enabled: !!token,
        retry: false,
      },
    }
  )

  useEffect(() => {
    if (!data) return

    const accessToken = (data as any)?.accessToken
    if (accessToken) {
      setAuth(accessToken)
    }

    toast.success( 
      t("auth.verify.activationSuccess")
    )
    navigate('/?email_verified=true', { replace: true })
  }, [data, navigate, setAuth])

  useEffect(() => {
    if (!error) return

    if (axios.isAxiosError(error)) {
      const status = error.response?.status

      if (status === 409) {
        toast.info(t("auth.verify.accountAlreadyActivated"))
        navigate('/login', { replace: true })
        return
      }
    }

    toast.error(t("auth.verify.activationError"))
    navigate('/signup', { replace: true })
  }, [error, navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-medium animate-pulse">
          {isLoading ? t("common.loading") : t("auth.verify.loading")}
        </p>
      </div>
    </div>
  )
}

export default VerifyEmailPage
