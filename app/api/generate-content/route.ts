import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth, db } from "@/lib/firebaseAdmin";
import { Entity } from "@/types";
import { Timestamp } from "firebase-admin/firestore";
import { Job } from "@/types/job";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {

    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decodedClaims;
    try {
      decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      console.error("Error verifying session cookie:", error);
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const uid = decodedClaims.uid;
  
    const { audienceId, generationJobTitle, contentType, content, context }: { audienceId: string, generationJobTitle: string, contentType: string, content: string | undefined, context: string | undefined } = await request.json();

    if (!audienceId || !generationJobTitle || !contentType || !context) {
        return NextResponse.json({ error: "audienceId, generationJobTitle, contentType, and context are required" }, { status: 400 });
    }
    if(content && content.length > 5000) {
        return NextResponse.json({ error: "Content must be less than 5000 characters" }, { status: 400 });
    }
    if(context && context.length > 2000) {
        return NextResponse.json({ error: "Context must be less than 2000 characters" }, { status: 400 });
    }

    const audienceRef = await db.collection("users").doc(uid).collection("audiences").doc(audienceId).get();
    const audienceData = audienceRef.data();

    if (!audienceData) {
        return NextResponse.json({ error: "Audience not found" }, { status: 404 });
    }

    const audienceDescription = `The audience is named ${audienceData.name}. Their interests include ${audienceData.entities.map((e: Entity) => e.name).join(', ')}. Age distribution: ${JSON.stringify(audienceData.ageTotals)}. Gender distribution: ${JSON.stringify(audienceData.genderTotals)}.`;

    const prompt = `You are an AI assistant specialized in tailoring ${contentType} content for specific target audiences. ${audienceDescription}.
    
    !!IMPORTANT: Additional Context: ${context}
    
    Based on the audience description and additional context, please provide the refined content. Focus on tone, vocabulary, and style to resonate with the target audience.
    
    !!IMPORTANT: your response should **ONLY** be the refined content.`;

    try {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
        });

        
        const docRef = db.collection("users").doc(uid).collection("jobs").doc();
        const newJob = {
            id: docRef.id,
            title: generationJobTitle,
            audience: {
                id: audienceId,
                name: audienceData.name || '',
                imageUrl: audienceData.imageUrl || null,
            },
            contentType,
            generatedContent: chatCompletion.choices[0].message.content || '',
            originalContent: content || '',
            context: context || '',
            createdAt: Timestamp.fromDate(new Date()),
        } as Job;
        await docRef.set(newJob);
        console.log("new job : ", newJob)

        return NextResponse.json(newJob);
    } catch (error) {
        console.error("Error generating content:", error);
        return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
    }
}