import { NextRequest, NextResponse } from 'next/server';
import { EntityTypes } from '@/constants/entity';
import { auth, db, storage } from '@/lib/firebaseAdmin';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define interfaces for API responses
interface QlooApiEntity {
  entity_id: string;
  name: string;
  popularity?: number;
  types: string[];
  properties?: {
    image?: {
      url?: string;
    };
  };
  image?: string;
}

interface DemographicData {
  entity_id: string;
  query: {
    age: Record<string, number>;
    gender: Record<string, number>;
  };
}

interface ProcessedEntity {
  id: string;
  name: string;
  popularity: number;
  type: string;
  image: string | null;
  age?: Record<string, number>;
  gender?: Record<string, number>;
}

// Add new interfaces for audienceData
interface InputEntity {
  id: string;
  name: string;
  subText?: string;
  popularity: number;
  type: string;
  imageUrl: string;
}

interface AudienceOption {
  value: string;
  label: string;
}

type AgeGroup = '24_and_younger' | '25_to_29' | '30_to_34' | '35_to_44' | '45_to_54' | '55_and_older';
type Gender = 'all' | 'male' | 'female';

interface AudienceData {
  entities: InputEntity[];
  audiences: AudienceOption[];
  ageGroup: AgeGroup[];
  gender: Gender;
}

async function generateAndUploadAvatar(audienceName: string, ageGroup: AgeGroup[], gender: Gender, entities: InputEntity[], audiences: AudienceOption[]): Promise<string> {
  const prompt = `Create a high-quality, close-up headshot avatar in a semi-cartoon, stylized illustration style. The avatar should represent the target audience: ${audienceName}, identifying as ${gender}, aged ${ageGroup.join(" and ")}. 

  They are passionate about topics such as ${audiences.map((e: AudienceOption) => e.label).join(", ")}, and they enjoy ${entities.map((e: InputEntity) => e.name).join(", ")}.
  
  The face should appear expressive and engaging, showing personality traits of curiosity, creativity, and modern sensibilities. Avoid using specific brands, logos, or copyrighted characters.
  
  Use a plain or minimal background. The character should face forward or at a 3/4 angle, capturing only the head and shoulders. Use a soft, colorful, professional aesthetic similar to character concept art or editorial avatars.`;
  
  
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

  const bucketName = `${process.env.FIREBASE_PROJECT_ID}`;
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


  
  const { audienceName, audienceData }: { audienceName: string; audienceData: AudienceData } = await request.json();
  const qlooApiKey = process.env.QLOO_API_KEY;
  if (!qlooApiKey || !audienceName || !audienceData) {
    return NextResponse.json(
      { error: "Missing audience name or data" },
      { status: 400 }
    );
  }

  const { entities, audiences, gender, ageGroup } = audienceData;
  console.log("audienceData", audienceData);

  const inputEntitiesRes = await fetch(`https://hackathon.api.qloo.com/entities?entity_ids=${entities.map((e: InputEntity) => e.id).join(",")}`, {
    headers: {
      "x-api-key": qlooApiKey,
      "accept": "application/json",
    },
  });
  const inputEntitiesData = await inputEntitiesRes.json();
  const inputEntities: ProcessedEntity[] = inputEntitiesData.results.map((inputEntity: QlooApiEntity) => {
    return {
      id: inputEntity.entity_id,
      name: inputEntity.name,
      popularity: inputEntity.popularity ?? 0,
      type: inputEntity.types[0].split(":").pop()?.toUpperCase() || 'UNKNOWN',
      image: inputEntity.properties?.image?.url || null,
    }   
  })

  
  const recommendedEntities = await Promise.all(
    Object.keys(EntityTypes).map(async (key) => {
      const entityIds = inputEntities.map((e: ProcessedEntity) => e.id).join(",");
      const audienceIds = audiences.map((e: AudienceOption) => e.value).join(",");
      let url = `https://hackathon.api.qloo.com/v2/insights?filter.type=${EntityTypes[key as keyof typeof EntityTypes]}&signal.interests.entities=${entityIds}&signal.demographics.audiences=${audienceIds}&signal.demographics.age=${ageGroup}`
      if(gender == "male" || gender == "female") url += `&signal.demographics.gender=${gender}`
      const entityData = await fetch(url, {
        headers: {
          "x-api-key": qlooApiKey,
          "accept": "application/json",
        },
      });
      console.log("entityData", entityData);
      if(entityData.status !== 200) return null;
      const data = await entityData.json();
      if(data.results.entities.length < 1) return null;

      const entity = data.results.entities[0];
      return {
        id: entity.entity_id,
        name: entity.name,
        popularity: entity.popularity ?? 0, // Provide default value for undefined popularity
        type: key,
        image: entity.properties?.image?.url || null,
      };
    })
  );

    const audienceEntities = [...recommendedEntities, ...inputEntities];

    const demographics = await fetch(`https://hackathon.api.qloo.com/v2/insights?filter.type=urn:demographics&signal.interests.entities=${audienceEntities.map(e => e?.id).filter(Boolean).join(",")}`, {
      headers: {
        "x-api-key": qlooApiKey,
        "accept": "application/json",
      },
    });

    const demographicsData = await demographics.json();
    const demographicsList: DemographicData[] = demographicsData.results.demographics || [];

    const demographicsMap: Record<string, { age: Record<string, number>, gender: Record<string, number> }> = {};
    for (const demographic of demographicsList) {
      const age = demographic.query.age;
      const gender = demographic.query.gender;

      demographicsMap[demographic.entity_id] = { age, gender };
    }

    function addDemographics(arr: ProcessedEntity[]): ProcessedEntity[] {
      return arr.map(entity => {
        const id = entity.id;
        const demo = demographicsMap[id];
        if (demo) {
          return { ...entity, ...demo };
        }
        return entity;
      });
    }
    const entitiesWithDemo = addDemographics(inputEntities);
    const recommendedEntitiesWithDemo = addDemographics(recommendedEntities.filter(Boolean) as ProcessedEntity[]);


    const ageTotals = {
      "24_and_younger": 0,
      "25_to_29": 0,
      "30_to_34": 0,
      "35_to_44": 0,
      "45_to_54": 0,
      "55_and_older": 0,
    }
    const genderTotals = {
      "male": 0,
      "female": 0,
    }

    for (const entity of entitiesWithDemo) {
      if (entity.age) {
        for (const [ageKey, value] of Object.entries(entity.age)) {
          if (ageKey in ageTotals) {
            ageTotals[ageKey as keyof typeof ageTotals] += Number(value);
          }
        }
      }
      if (entity.gender) {
        for (const [genderKey, value] of Object.entries(entity.gender)) {
          if (genderKey in genderTotals) {
            genderTotals[genderKey as keyof typeof genderTotals] += Number(value);
          }
        }
      }
    }

    function roundObj(obj: Record<string, number>, decimals = 4) {
      const out: Record<string, number> = {};
      for (const key in obj) {
        out[key] = Math.round((obj[key] + Number.EPSILON) * 10**decimals) / 10**decimals;
      }
      return out;
    }

    const imageUrl = await generateAndUploadAvatar(audienceName, ageGroup, gender, entities, audiences);

    const newAudience = {
      name: audienceName,
      entities: entitiesWithDemo,
      recommendedEntities: recommendedEntitiesWithDemo,
      demographics: audiences,
      ageTotals: roundObj(ageTotals),
      genderTotals: roundObj(genderTotals),
      imageUrl,
    }
    const docRef = db.collection("users").doc(uid).collection("audiences").doc();
    await docRef.set(newAudience);

    return NextResponse.json({...newAudience, id: docRef.id});
}