import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Forzamos la carga del archivo .env desde la raíz
dotenv.config();

// Ahora sí, leemos la variable
const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = "7d";

if (!SECRET) {
  throw new Error("[jwt] Falta la variable de entorno JWT_SECRET. Agrégala en tu .env.");
}

/** Firma un token de sesión. */
export function signSession(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/** Verifica un token. Devuelve el payload, o null si es inválido/expiró. */
export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

/** Nombre de la cookie de sesión (se usa en login, logout y middleware). */
export const SESSION_COOKIE = "ua_session";
