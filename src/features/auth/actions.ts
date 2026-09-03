"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";
const ATTEMPTS_COOKIE = "admin_login_attempts_v2";
const MAX_ATTEMPTS = 3;
const ATTEMPTS_WINDOW_SECONDS = process.env.NODE_ENV === "production" ? 15 * 60 : 1;

function getSessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("Falta configurar ADMIN_SESSION_SECRET en el archivo .env");
  }

  return createHmac("sha256", secret).update("admin-authenticated").digest("hex");
}

function isValidSession(value: string | undefined) {
  if (!value) return false;

  const expected = Buffer.from(getSessionToken());
  const received = Buffer.from(value);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function loginAdminAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  const parsedAttempts = Number(cookieStore.get(ATTEMPTS_COOKIE)?.value ?? "0");
  const attempts = Number.isFinite(parsedAttempts) && parsedAttempts >= 0 ? parsedAttempts : 0;

  console.log("[admin-login] intento recibido", {
    username,
    attempts,
    hasConfiguredUsername: Boolean(configuredUsername),
    hasConfiguredPassword: Boolean(configuredPassword),
    hasSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
    usernameMatches: username === configuredUsername,
    passwordMatches: password === configuredPassword,
    windowSeconds: ATTEMPTS_WINDOW_SECONDS,
  });

  if (!configuredUsername || !configuredPassword || !process.env.ADMIN_SESSION_SECRET) {
    console.error("[admin-login] faltan variables de entorno requeridas");
    redirect("/login?error=config");
  }

  if (attempts >= MAX_ATTEMPTS) {
    console.warn("[admin-login] acceso bloqueado por máximo de intentos", { attempts });
    redirect("/login?error=locked");
  }

  if (username !== configuredUsername || password !== configuredPassword) {
    const nextAttempts = attempts + 1;

    console.warn("[admin-login] credenciales incorrectas", { nextAttempts });

    cookieStore.set(ATTEMPTS_COOKIE, String(nextAttempts), {
      httpOnly: true,
      maxAge: ATTEMPTS_WINDOW_SECONDS,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/login",
    });

    redirect(`/login?error=${nextAttempts >= MAX_ATTEMPTS ? "locked" : "invalid"}`);
  }

  cookieStore.delete(ATTEMPTS_COOKIE);
  cookieStore.set(SESSION_COOKIE, getSessionToken(), {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  console.log("[admin-login] acceso correcto");
  redirect("/admin");
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  try {
    return isValidSession(cookieStore.get(SESSION_COOKIE)?.value);
  } catch {
    return false;
  }
}