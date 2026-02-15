import { cn } from '@/lib/utils';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom'

interface ResetConfirmationModalProps {
    timeLeft: number
    onResend?: () => void
}

export const ResetConfirmationModal = ({ timeLeft, onResend }: ResetConfirmationModalProps) => {
    const navigate = useNavigate();
    
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    };
    
    const isResendDisabled = timeLeft > 0;
    
    return (
        <div className="flex w-full flex-col gap-8.5">
            <div className="flex flex-col gap-9.5">
                <h1 className="text-center text-[34px] font-bold leading-[1.167] tracking-[-1.5px] text-[#eaf6f3]">
                    {t("changePassword.title")}
                </h1>

                <div className="flex flex-col gap-3 text-[16px] leading-[1.167] text-[#bfd9d2]">
                    <p>{t("changePassword.subtitle")}</p>
                    <p>{t("changePassword.emailFolder")}</p>
                </div>
            </div>

            <button
                onClick={() => navigate("/login")}
                className={cn(
                    "flex h-12.5 w-full items-center justify-center gap-3.5 rounded-[10px] border border-white/65",
                    "bg-linear-to-b from-[rgba(49,95,85,0.55)] to-[rgba(49,95,85,0.18)]",
                    "backdrop-blur-[7px] shadow-[0px_14px_26px_0px_rgba(0,0,0,0.35)]",
                    "[box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_14px_26px_0px_rgba(0,0,0,0.35)]",
                    "text-[16px] font-medium leading-[1.167] tracking-[-1.5px] text-[#eaf6f3]",
                    "transition-opacity hover:opacity-90 cursor-pointer"
                )}
            >
                {t("changePassword.backToLoginButton")}
            </button>

            <button
                onClick={onResend}
                disabled={isResendDisabled}
                className={cn(
                    "flex w-full items-center justify-center gap-5 rounded-[10px] border px-4 py-3",
                    "transition-all duration-200",
                    isResendDisabled 
                        ? "border-white/10 cursor-not-allowed opacity-50"
                        : "border-white/65 cursor-pointer hover:opacity-90 bg-linear-to-b from-[rgba(49,95,85,0.55)] to-[rgba(49,95,85,0.18)]"
                )}
            >
                <p className="text-[14px] leading-[1.167] tracking-[-1.5px] text-[#eaf6f3]">
                    {isResendDisabled ? t("changePassword.retry") : t("changePassword.resendNow")}
                </p>
                <span className="text-[24px] font-semibold leading-[1.167] tracking-[-1.5px] text-[#315e55]">
                    {isResendDisabled ? formatTime(timeLeft) : ""}
                </span>
            </button>
        </div>
    )
}