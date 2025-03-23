import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";



export async function POST(req : Request) {
    try {

        const jwtsecret = process.env.NEXT_PUBLIC_JWT_SECRET as string; // Avoid exposing to frontend
        if (!jwtsecret) {
          return NextResponse.json({ error: "JWT secret is missing" }, { status: 500 });
        }

        const {email, password} = await req.json();
        const findUserExists = await prisma.user.findFirst({
            where: { email }          
        })

        if(!findUserExists)
            return NextResponse.json({success : false, message : "Email does not exists. Try again or sign up."}, {status : 401});

        const unhashedPassword = await bcrypt.compare(password, findUserExists.password);
        if(!unhashedPassword)
            return NextResponse.json({success : false, message : "Invalid credentials."}, {status : 401})

        const token = jwt.sign({email}, jwtsecret, {expiresIn : "1h"})

        const response = NextResponse.json({message: "Logged in successfully", success : true },{status:201});

        response.headers.set(
            "Set-Cookie",
            serialize("auth_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/"
            })
        )

        return response;

    } catch (error) {
        return NextResponse.json({error : "Login failed. Please try again."}, {status:500})    }

}