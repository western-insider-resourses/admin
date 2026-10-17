"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { clearLegacyToken, inviteCodeRequired, login, signup } from "@/lib/auth";
import { SITE_NAME } from "@/lib/api";
import { errorMessage } from "@/lib/utils";
import { Button, Card, Notice, TextField } from "@/components/ui";
import navyLogo from "@/assets/navy_logo_transparent.png";

export const MIN_PASSWORD = 8;

// One form for both "Sign in" and "Create account"
export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    clearLegacyToken();
    if (isSignup) void inviteCodeRequired().then(setNeedsCode);
  }, [isSignup]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (isSignup) {
      if (password.length < MIN_PASSWORD)
        return setError(
          `Use a password of at least ${MIN_PASSWORD} characters.`,
        );
      if (password !== confirm)
        return setError("The two passwords do not match.");
    }
    setBusy(true);
    try {
      if (isSignup)
        await signup(email, password, needsCode ? inviteCode : undefined);
      else await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-3 flex flex-col items-center">
          <Image src={navyLogo} alt="" width={147} height={111} priority className="h-16 w-auto object-contain" />
          <p className="mt-1 font-serif text-lg font-extrabold leading-tight text-ink">{SITE_NAME}</p>
          <p className="mt-1 text-sm font-semibold text-mute">Admin portal</p>
        </div>
        <form onSubmit={submit} className="mt-1 space-y-4">
          <h1 className="font-serif text-2xl font-bold">
            {isSignup ? "Create admin account" : "Admin sign in"}
          </h1>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            hint={
              isSignup ? `(at least ${MIN_PASSWORD} characters)` : undefined
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isSignup && (
            <TextField
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          )}
          {isSignup && needsCode && (
            <TextField
              label="Invite code"
              hint="(ask the site owner)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          )}
          <Notice error={error} />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={busy}
          >
            {busy
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-mute">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-crimson">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Need an account?{" "}
              <Link href="/signup" className="font-semibold text-crimson">
                Sign up
              </Link>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}
