"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  MdOutlineMailOutline,
  MdOutlineLock,
  MdOutlinePerson,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";

type Mode = "signin" | "register";

const OTP_LEN = 6;

const inputClass =
  "h-10 w-full rounded-lg border border-neutral-200 pl-9 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-xs font-medium text-neutral-500";

const iconClass =
  "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400";

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const maskedLocal =
    local.length <= 1 ? local : `${local[0]}${"*".repeat(local.length - 1)}`;
  return `${maskedLocal}@${domain}`;
};

const mmss = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!otpSent) return;
    setSecondsLeft(60);
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [otpSent]);

  const isRegister = mode === "register";
  const isOtp = !isRegister && method === "otp";

  const canSubmit = isRegister
    ? Boolean(name.trim() && email.trim() && password.trim() && confirm.trim())
    : isOtp
      ? otpSent
        ? code.length === OTP_LEN
        : Boolean(email.trim())
      : Boolean(email.trim() && password.trim());

  const resendCode = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(60);
    setCode("");
  };

  const resetAuthFlow = () => {
    setOtpSent(false);
    setCode("");
    setError("");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setMethod("password");
    resetAuthFlow();
  };

  const switchMethod = (m: "password" | "otp") => {
    setMethod(m);
    resetAuthFlow();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (isOtp) {
      if (!otpSent) {
        setOtpSent(true);
        setError("");
        return;
      }
      setError("");
      onAuth();
      return;
    }
    if (isRegister && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    onAuth();
  };

  const submitLabel = isRegister
    ? "Create account"
    : isOtp
      ? otpSent
        ? "Verify & sign in"
        : "Send code"
      : "Sign in";

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#f4efed] px-6 py-10">
      <div
        aria-hidden="true"
        className="blob-a pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="blob-b pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#4d7d94]/15 blur-3xl [animation-delay:-6s]"
      />
      <div
        aria-hidden="true"
        className="blob-a pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#a6516f]/15 blur-3xl [animation-delay:-9s]"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-mark.png"
              alt="Talli logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9 max-w-none rounded"
            />
            <span className="text-2xl font-semibold tracking-tight text-neutral-900">
              Talli
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            {isRegister
              ? "Create your account to get started."
              : "Welcome back. Sign in to continue."}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-6 flex min-h-[32rem] flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1 text-sm font-medium">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`h-9 cursor-pointer rounded-lg transition-colors ${
                !isRegister
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`h-9 cursor-pointer rounded-lg transition-colors ${
                isRegister
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Create account
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {isRegister && (
              <div>
                <label className={labelClass}>Full name</label>
                <div className="relative">
                  <MdOutlinePerson className={iconClass} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Juan Dela Cruz"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {!(isOtp && otpSent) && (
              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <MdOutlineMailOutline className={iconClass} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {!isOtp && (
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <MdOutlineLock className={iconClass} />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-neutral-400 transition-colors hover:text-neutral-600"
                  >
                    {showPw ? (
                      <MdOutlineVisibilityOff className="h-4 w-4" />
                    ) : (
                      <MdOutlineVisibility className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {isOtp && otpSent && (
              <div>
                <label className={labelClass}>Verification code</label>
                <input
                  inputMode="numeric"
                  value={code}
                  onChange={(e) =>
                    setCode(
                      e.target.value.replace(/\D/g, "").slice(0, OTP_LEN),
                    )
                  }
                  placeholder="6-digit code"
                  autoFocus
                  className="h-10 w-full rounded-lg border border-neutral-200 px-3 text-center text-sm tracking-[0.4em] text-neutral-900 outline-none transition-colors placeholder:tracking-normal placeholder:text-neutral-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />

                <p className="mt-3 text-xs text-neutral-400">
                  Sent to{" "}
                  <span className="font-medium text-neutral-600">
                    {email ? maskEmail(email) : "your email"}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={secondsLeft > 0}
                  className="mt-1 text-xs font-medium text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:font-normal disabled:text-neutral-400 disabled:no-underline enabled:cursor-pointer"
                >
                  {secondsLeft > 0
                    ? `Resend code in ${mmss(secondsLeft)}`
                    : "Resend code"}
                </button>
              </div>
            )}

            {isRegister && (
              <div>
                <label className={labelClass}>Confirm password</label>
                <div className="relative">
                  <MdOutlineLock className={iconClass} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-neutral-400 transition-colors hover:text-neutral-600"
                  >
                    {showConfirm ? (
                      <MdOutlineVisibilityOff className="h-4 w-4" />
                    ) : (
                      <MdOutlineVisibility className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && <p className="mt-3 text-xs text-[#a6516f]">{error}</p>}

          {!isRegister && !isOtp && (
            <div className="mt-3 flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-neutral-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer rounded border-neutral-300 accent-primary"
                />
                Remember me
              </label>
              <button
                type="button"
                className="cursor-pointer font-medium text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-5 flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
          >
            {submitLabel}
          </button>

          {!isRegister && (
            <>
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs text-neutral-400">or</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>
              <button
                type="button"
                onClick={() => switchMethod(isOtp ? "password" : "otp")}
                className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {isOtp ? "Sign in with password" : "Login with OTP"}
              </button>
            </>
          )}

          <p className="mt-auto pt-4 text-center text-xs text-neutral-400">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(isRegister ? "signin" : "register")}
              className="cursor-pointer font-medium text-primary hover:underline"
            >
              {isRegister ? "Sign in" : "Create one"}
            </button>
          </p>
        </form>
      </div>

      <footer className="absolute inset-x-0 bottom-4 text-center text-xs text-neutral-400">
        © 2026 Soul Coffee. All rights reserved.
      </footer>
    </div>
  );
}
