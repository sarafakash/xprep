import { cookies} from "next/headers"
import { NextResponse } from "next/server"
import * as jose from 'jose'; 
import { prisma } from "@/lib/prisma";

export async function GET(){
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    let email;
    if(!token)
        return NextResponse.json({sucess: false, message: "Token Error."}, {status: 401})

    try {
        const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(jwtSecret));
        email = payload.email;

    } catch (error) {
        return NextResponse.json({sucess: false, message: "Decode Error."}, {status: 401})
    }

    try {
        const userData = await prisma.user.findUnique({where : {email : email as string}, select: {id : true,name: true, email: true}})
        return NextResponse.json(userData)
    } catch (error) {
        return NextResponse.json({sucess: false, message: "DB call failed."}, {status: 401})
  
    }
}