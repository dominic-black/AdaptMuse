import { NextRequest, NextResponse } from 'next/server';
import { EntityTypes } from '@/constants/entity';
import { auth, db } from '@/lib/firebaseAdmin';

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


  
  const { audienceName, audienceData } = await request.json();
  const qlooApiKey = process.env.QLOO_API_KEY;
  if (!qlooApiKey || !audienceName || !audienceData) {
    return NextResponse.json(
      { error: "Missing audience name or data" },
      { status: 400 }
    );
  }

  const { entities, audiences, gender, ageGroup } = audienceData;

  const inputEntitiesRes = await fetch(`https://hackathon.api.qloo.com/entities?entity_ids=${entities.map((e: any) => e.id).join(",")}`, {
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
      popularity: inputEntity.popularity ?? 0, // Provide default value for undefined popularity
      type: inputEntity.types[0].split(":").pop()?.toUpperCase() || 'UNKNOWN',
      image: inputEntity.properties?.image?.url || null,
    }   
  })

  
  const recommendedEntities = await Promise.all(
    Object.keys(EntityTypes).map(async (key) => {
      const entityIds = inputEntities.map((e: any) => e.id).join(",");
      const audienceIds = audiences.map((e: any) => e.value).join(",");
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

    const newAudience = {
      name: audienceName,
      entities: entitiesWithDemo,
      recommendedEntities: recommendedEntitiesWithDemo,
      demographics: audiences,
      ageTotals: roundObj(ageTotals),
      genderTotals: roundObj(genderTotals),
    }
    console.log("newAudience", newAudience);
    await db.collection("users").doc(uid).collection("audiences").doc().set(newAudience);

    return NextResponse.json({...newAudience});
}