import { AgeGroup, Gender, Entity, AudienceOption } from '@/types';
import { storage } from '@/lib/firebaseAdmin';
import OpenAI from 'openai';

export async function generateAndUploadAvatar(openai: OpenAI, audienceName: string, ageGroup: AgeGroup[], gender: Gender, entities: Entity[], audiences: AudienceOption[]): Promise<string> {
    return null;
    const prompt = `Create a clean, vector-style cartoon profile picture as a close-up headshot of a ${gender !== "all" ? gender : ""} individual aged: ${ageGroup.join(" and ")}.
    
    The headshot should reflect a person who enjoys ${audiences.map((e: AudienceOption) => e.label).join(", ")} and is interested in ${entities.map((e: Entity) => e.name).join(", ")}.
    
    The image should be cartoonish and modern. It should only include the head and shoulders, with a neutral or friendly expression, and no text or logos. Avoid photorealism. No background. IMPORTANT: The image should contain no words at all.`;
    
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    console.log("open ai response", response);
  
    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('Failed to generate image.');
    }
  
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch the generated image.');
    }
    const imageBuffer = await imageResponse.arrayBuffer();
  
    const bucketName = `${process.env.FIREBASE_STORAGE_BUCKET}`;
    const bucket = storage.bucket(bucketName);
    const fileName = `audience_avatars/${audienceName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    const file = bucket.file(fileName);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'image/png',
      },
    });
  
    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('finish', async () => {
        await file.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
        resolve(publicUrl);
      });
      stream.end(Buffer.from(imageBuffer));
    });
  }