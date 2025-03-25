import { cookies } from "next/headers";
import * as jose from 'jose';
import { prisma } from "./prisma";

export async function getCurrentUser(){
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    let email;
    if(!token)
        return null;

    try {
        const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(jwtSecret));
        email = payload.email;

    } catch (error) {
        return null;
    }

    try {
        const userData = await prisma.user.findUnique({where : {email : email as string}, select: {id : true,name: true, email: true}})
        return userData;
    } catch (error) {
        return null;
  
    }
}