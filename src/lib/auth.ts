import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

const TOKEN_COOKIE = "amigo_admin_token";

export async function hashPassword(plain: string) {
	return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
	return bcrypt.compare(plain, hash);
}

export async function createJwt(payload: object) {
	const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
	const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
	const token = await new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(expiresIn)
		.sign(secret);
	return token;
}

export async function verifyJwt(token: string) {
	const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
	return jwtVerify(token, secret);
}

export async function setAuthCookie(token: string) {
	cookies().set(TOKEN_COOKIE, token, {
		httpOnly: true,
		path: "/",
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});
}

export function clearAuthCookie() {
	cookies().delete(TOKEN_COOKIE);
} 