import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  ShieldCheck, 
  LockKeyhole, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2,
  TimerReset,
  Send
} from "lucide-react";
import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import { resetPasswordWithToken, requestPasswordReset } from "../../api/auth";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // Grab email passed from ForgotPassword

  // Form State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Resend PIN State
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const otpRefs = useRef([]);
  
  // Derived state
  const pin = otp.join("");
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // --- Cooldown Timer Effect ---
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // --- Resend PIN Handler ---
  const handleResendPin = async () => {
    if (!email) {
      toast.error("Session expired. Please start over.");
      navigate("/forgot-password");
      return;
    }

    setIsResending(true);
    setError("");
    setMessage("");

    try {
      await requestPasswordReset({ email });
      toast.success("A new PIN has been sent to your email.");
      setCooldown(60); // Start 60 second cooldown
      setOtp(["", "", "", "", "", ""]); // Clear existing OTP boxes
      otpRefs.current[0]?.focus();
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message || "Failed to resend PIN. Try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  // --- OTP Input Handlers ---
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); 
    if (!value && e.target.value !== "") return; 

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); 
    setOtp(newOtp);

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
      
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex].focus();
    }
  };

  // --- Form Submission ---
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (pin.length !== 6) {
      setError("Please enter the complete 6-digit PIN.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await resetPasswordWithToken({
        token: pin,
        password,
        confirmPassword,
      });

      setMessage(response.data.message);
      toast.success("Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        "Unable to reset your password right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center py-16 px-4">
      <Container>
        <div className="max-w-md mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl rounded-[2rem] border border-white/60 dark:border-slate-700/50 p-8 sm:p-10 transition-all duration-300">
          
          {/* Icon Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-5">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center tracking-tight">
              Secure Reset
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base leading-relaxed px-2">
              Enter the 6-digit code sent to your email to create a new password.
            </p>
          </div>

          {/* Alerts */}
          {message && (
            <div className="mb-6 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-700 dark:text-green-400 flex items-start gap-3">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* 6-Box PIN Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                Security PIN
              </label>
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
                    className="w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 shadow-sm outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    placeholder="-"
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                <LockKeyhole size={20} />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="New password"
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                <LockKeyhole size={20} />
              </div>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                className={`w-full pl-12 pr-12 py-3.5 bg-gray-50/50 dark:bg-slate-900/50 border rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-gray-900 dark:text-white ${
                  confirmPassword && !passwordsMatch 
                    ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-200 dark:border-slate-700'
                }`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {passwordsMatch && (
                  <span className="text-green-500 animate-in fade-in zoom-in duration-200">
                    <CheckCircle2 size={18} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading || pin.length !== 6 || !password || !confirmPassword} 
              className="w-full py-3.5 mt-2 rounded-xl text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/* Resend PIN Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/50 text-center space-y-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Didn't receive a code?
            </p>
            
            {cooldown > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                <TimerReset size={16} />
                <span>You can request a new PIN in <strong className="text-gray-600 dark:text-gray-300">{cooldown}s</strong></span>
              </div>
            ) : (
              <button 
                onClick={handleResendPin}
                disabled={isResending}
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Resend PIN
                  </>
                )}
              </button>
            )}

            {/* Fallback option if user needs to change email */}
            {cooldown === 0 && (
              <div className="pt-2">
                 <Link to="/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 transition-colors">
                  Use a different email address
                </Link>
              </div>
            )}
          </div>

        </div>
      </Container>
    </section>
  );
};

export default ResetPassword;