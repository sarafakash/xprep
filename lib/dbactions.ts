"use server";
import { cookies } from "next/headers";
import * as jose from 'jose';
import { prisma } from "./prisma";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { feedbackSchema } from "@/constants";

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


export async function getInterviewByUserId(userId : number) : Promise<Interview[] | null> {

    const interviews = await prisma.interview.findMany({where : {userId}, orderBy: [{createdAt : 'desc'}]})

    return interviews;

}

export async function getTheInterviewByInterviewId(id : number) : Promise<Interview| null> {

    const interview = await prisma.interview.findFirst({where : {id}})

    return interview;

}

export async function createFeedback(params : CreateFeedbackParams) {

    const {interviewId, userId, transcript, feedbackId} = params;
    try {
        const formattedTranscript = transcript.map((sentence: {role: string; content: string;})=> (
            `- ${sentence.role}: ${sentence.content}\n`
        )).join('');

        const {object : {totalScore, categoryScores, strengths, areasForImprovement, finalAssessment}} = await generateObject({
            model: google('gemini-2.0-flash-001', {structuredOutputs: false}),
            schema: feedbackSchema,
            prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
            system:  "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",

        })

        const feedback = await prisma.feedback.create({
            data : {
                interviewId,
                userId,
                totalScore,
                categoryScores,
                strengths,
                areasForImprovement,
                finalAssessment
            }
        })

        return {
            success : true,
            feedbackId : feedback.id 
        }
    } catch (error) {
        console.log("Error saving feedback.",error);
        return {
            success : false
        }
    }

}

export async function getFeedbackByInterviewId(params : GetFeedbackByInterviewIdParams ) : Promise<Feedback | null> {

    const {interviewId, userId} = params;

        const feedback = await prisma.feedback.findFirst({
            where : {
                interviewId : interviewId,
                userId : userId
            }
        })

        if(!feedback) return null;

        const { id, categoryScores, ...rest } = feedback;

        return {
            id : feedback.id,
            categoryScores: (categoryScores as { name: string; score: number; comment: string; }[]) || [],
            ...rest
        };
        
    } 


    export async function logout() {
        const cookieStore = await cookies(); 
        cookieStore.delete('auth_token'); 
      }