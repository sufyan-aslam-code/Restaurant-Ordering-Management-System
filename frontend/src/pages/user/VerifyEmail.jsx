import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Loader2, AlertCircle, Send, TimerReset } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import { verifyEmailToken, resendVerificationEmail } from "../../api/auth";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Grab the email from navigation state if they just registered
  const registeredEmail = location.state?.email || "";

  // 6-Box OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const pin = otp.join("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  // Cooldown state for resend button
  const [cooldown, setCooldown] = useState(0);

  // --- OTP Input Handlers ---
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); 
    if (!value && e.target.value !== "") return; 

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); 
    setOtp(newOtp);
    if (error) setError("");

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpRefs.current[index - 1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      if (error) setError("");
      
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex].focus();
    }
  };

  // --- Submission Handlers ---
  const handleVerify = async (event) => {
    event.preventDefault();

    if (pin.length !== 6) {
      setError("Please enter the complete 6-digit PIN.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send the PIN directly as the token
      await verifyEmailToken({ token: pin });

      toast.success("Account created successfully! You can now log in.");

      // Short delay so they can see the toast before route change
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        "Invalid or expired PIN. Please try again."
      );
      // Optional: Clear the boxes on error so they can type again easily
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (event) => {
    event.preventDefault();

    // Prevent resend during cooldown
    if (cooldown > 0) return;

    if (!registeredEmail) {
      setError("Email address not found. Please log in to resend.");
      return;
    }

    setResending(true);
    setError("");

    try {
      await resendVerificationEmail({ email: registeredEmail });

      toast.success("A new verification PIN has been sent!");
      
      // Clear the boxes for the new PIN
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();

      // Start 60-second cooldown
      setCooldown(60);

      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        "Unable to resend the verification PIN right now."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center py-16 px-4">
      <Container>
        <div className="max-w-md mx-auto bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl rounded-[2rem] border border-white/60 dark:border-slate-700/50 p-8 sm:p-10 transition-all duration-300">

          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ShieldCheck size={38} className="text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Verify Email
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed px-4">
              Enter the 6-digit PIN sent to <strong className="text-gray-700 dark:text-gray-300">{registeredEmail || "your email"}</strong> to complete verification.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleVerify}>
            
            {/* 6-Box PIN Input */}
            <div className="flex justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white dark:bg-slate-900/50 border rounded-xl focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white ${
                    error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-slate-700"
                  }`}
                  placeholder="-"
                />
              ))}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || pin.length !== 6}
              className="w-full py-4 rounded-xl text-base font-semibold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>

          {/* Resend Section */}
          <div className="text-center mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/50 space-y-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Didn't receive the PIN? Check your spam folder.
            </p>

            {cooldown > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                <TimerReset size={16} />
                <span>Resend available in <strong className="text-gray-600 dark:text-gray-300">{cooldown}s</strong></span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || !registeredEmail}
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Resend Verification PIN
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      </Container>
    </section>
  );
};

export default VerifyEmail;