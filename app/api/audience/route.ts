import { NextRequest, NextResponse } from 'next/server';
import { EntityTypes } from '@/constants/entity';
import { db } from '@/lib/firebaseAdmin';
import { requireAuth } from '@/lib/authMiddleware';
import OpenAI from 'openai';
import { QlooApiEntity, DemographicData, Entity, AgeGroup, AudienceOption, AudienceApiData } from '@/types';
import { generateAndUploadAvatar } from './utils';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const uid = user.uid;

    const { audienceName, audienceData }: { audienceName: string; audienceData: AudienceApiData } = await request.json();

    const qlooApiKey = process.env.QLOO_API_KEY;
    
    if (!qlooApiKey || !audienceName || !audienceData) {
      return NextResponse.json(
        { error: "Missing audience name or data" },
        { status: 400 }
      );
    }

    const { entities, audiences, gender, ageGroup, genres } = audienceData;
    console.log("audienceData", audienceData);
    let inputEntities: Entity[] = [];

    if(entities.length > 0) {
      const inputEntitiesRes = await fetch(`https://hackathon.api.qloo.com/entities?entity_ids=${entities.map((e: Entity) => e.id).join(",")}`, {
        headers: {
          "x-api-key": qlooApiKey,
          "accept": "application/json",
        },
      });
      const inputEntitiesData = await inputEntitiesRes.json();
      console.log("inputEntitiesData", inputEntitiesData);
      if(inputEntitiesData && inputEntitiesData.results.length > 0) {
        inputEntities = inputEntitiesData.results.map((inputEntity: QlooApiEntity) => {
          return {
            id: inputEntity.entity_id,
            name: inputEntity.name,
            popularity: inputEntity.popularity ?? 0,
            type: inputEntity.types[0].split(":").pop()?.toUpperCase() || 'UNKNOWN',
            imageUrl: inputEntity.properties?.image?.url || null,
          }   
        })
      }
    }

    
    const recommendedEntities = await Promise.all(
      Object.keys(EntityTypes).map(async (key) => {
        const entityIds = inputEntities.map((e: Entity) => e.id).join(",");
        const audienceIds = audiences.map((e: AudienceOption) => e.value).join(",");
        let url = `https://hackathon.api.qloo.com/v2/insights?filter.type=${EntityTypes[key as keyof typeof EntityTypes]}&signal.demographics.audiences=${audienceIds}&signal.demographics.age=${ageGroup}&filter.tags=${genres.map((e: AudienceOption) => e.value).join(",")}`
        if(entityIds) url += `&signal.interests.entities=${entityIds}`
        if(gender === "male" || gender === "female") url += `&signal.demographics.gender=${gender}`
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
          imageUrl: entity.properties?.image?.url || null,
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

    function addDemographics(arr: Entity[]): Entity[] {
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
    const recommendedEntitiesWithDemo = addDemographics(recommendedEntities.filter(Boolean) as Entity[]);


    const ageTotals: Record<AgeGroup, number> = {
      "24_and_younger": 0,
      "25_to_29": 0,
      "30_to_34": 0,
      "35_to_44": 0,
      "45_to_54": 0,
      "55_and_older": 0,
    }
    const genderTotals: Record<"male" | "female", number> = {
      "male": 0,
      "female": 0,
    }

    for (const entity of [...entitiesWithDemo, ...recommendedEntitiesWithDemo]) {
      if (entity.age) {
        for (const [ageKey, value] of Object.entries(entity.age)) {
          if (ageKey in ageTotals) {
            ageTotals[ageKey as AgeGroup] += Number(value);
          }
        }
      }
      if (entity.gender) {
        for (const [genderKey, value] of Object.entries(entity.gender)) {
          if (genderKey in genderTotals) {
            genderTotals[genderKey as "male" | "female"] += Number(value);
          }
        }
      }
    }

    function roundObj<T extends Record<string, number>>(obj: T, decimals = 4): T {
      const out: Record<string, number> = {};
      for (const key in obj) {
        out[key] = Math.round((obj[key] + Number.EPSILON) * 10**decimals) / 10**decimals;
      }
      return out as T;
    }

    const imageUrl = await generateAndUploadAvatar(openai, audienceName, ageGroup, gender, entities, audiences);

    const newAudience = {
      name: audienceName,
      entities: entitiesWithDemo,
      recommendedEntities: recommendedEntitiesWithDemo,
      demographics: audiences,
      ageTotals: roundObj(ageTotals),
      genderTotals: roundObj(genderTotals),
      imageUrl: imageUrl || "https://cdn-icons-png.flaticon.com/512/1053/1053244.png",
    }
    const docRef = db.collection("users").doc(uid).collection("audiences").doc();
    await docRef.set(newAudience);

    return NextResponse.json({...newAudience, id: docRef.id});
  } catch (error) {
    // Handle authentication errors (these will be NextResponse objects)
    if (error instanceof NextResponse) {
      return error;
    }
    
    console.error("Error creating audience:", error);
    return NextResponse.json({ error: "Failed to create audience" }, { status: 500 });
  }
}