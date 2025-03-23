import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

export async function POST(req : Request) {
    try {
        const {name, email, password} = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: { email },
          });

        if (existingUser) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }  

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data : {name, email, password : hashedPassword}
        })

        return NextResponse.json(user,{status:201});    
    } catch (error) {
        return NextResponse.json({error : "Signup failed. Please try again."}, {status:500})
    }
}