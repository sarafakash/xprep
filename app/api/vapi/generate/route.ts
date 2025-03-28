import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google , createGoogleGenerativeAI  } from "@ai-sdk/google";

import { getRandomInterviewCover } from "@/public/utils";
import { prisma } from "@/lib/prisma";

export async function GET() {
    return NextResponse.json({success: true, data: 'Thankyou'}, {status : 200})
}

export async function POST(request: NextRequest){
    const body = await request.json();
    //console.log("Received Payload:", body); 
    
    const { type, role, level, techstack, amount, userid } = body; 

    const amountInt = parseInt(amount, 10);
    const useridInt = parseInt(userid, 10);
    const techstackArray = techstack.split(',').map((s: string) => s.trim());

    try {

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, error: "API key is missing" }, { status: 500 });
        }
        
        createGoogleGenerativeAI({
            apiKey: apiKey,
          });

        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview.
                    The job role is ${role}.
                    The job experience level is ${level}.
                    The tech stack used in the job is: ${techstack}.
                    The focus between behavioural and technical questions should lean towards: ${type}.
                    The amount of questions required is: ${amount}.
                    Please return only the questions, without any additional text.
                    The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                    Return the questions formatted like this:
                    ["Question 1", "Question 2", "Question 3"]
                    
                    Thank you! <3`,
        });

        const interview = {
            role, 
            type, 
            level, 
            amount : amountInt,
            techstack: techstackArray,
            questions: JSON.parse(questions), 
            userId: useridInt, 
            finalized: false, 
            coverImage: getRandomInterviewCover(), 
        }

        const response = await prisma.interview.create({
            data : interview
        })

        return NextResponse.json({success : true}, {status: 200})


    } catch (error) {
        console.log(error);
        return NextResponse.json({success : false, error}, {status: 500})
    }
}