import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req : Request) {
    try {
        const {name, email, password} = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: { email },
          });

        if (existingUser) {
        return NextResponse.json({success : false, message : "Email already exists."});
        }  

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data : {name, email, password : hashedPassword}
        })

        return NextResponse.json({success : true, user},{status:201});    
    } catch (error) {
        return NextResponse.json({error : "Signup failed. Please try again."}, {status:500})
    }
}