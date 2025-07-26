import { NextRequest, NextResponse } from 'next/server';
import { EntityTypes } from '@/constants/entity';
import { auth, db } from '@/lib/firebaseAdmin';



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

  const reccomendedEntities = await Promise.all(
    Object.keys(EntityTypes).map(async (key) => {

      const entityData = await fetch(`https://hackathon.api.qloo.com/v2/insights?filter.type=${EntityTypes[key as keyof typeof EntityTypes]}&signal.demographics.gender=${gender}&signal.interests.entities=${entities.map((e: any) => e.id).join(",")}&signal.demographics.audiences=${audiences.join(",")}&signal.demographics.age=${ageGroup}`, {
        headers: {
          "x-api-key": qlooApiKey,
          "accept": "application/json",
        },
      });
      const data = await entityData.json();
      console.log("data = ", data);
      if(data.results.entities.length < 1) return null;

      return {id: data.results.entities[0].entity_id, name: data.results.entities[0].name, subText: "suggested", popularity: data.results.entities[0].popularity, type: key, image: data.results.entities[0].image};
    })
  );

    const audienceEntities = [...reccomendedEntities, ...entities];

    const demographics = await fetch(`https://hackathon.api.qloo.com/v2/insights?filter.type=urn:demographics&signal.interests.entities=${audienceEntities.map(e => e.id).join(",")}`, {
      headers: {
        "x-api-key": qlooApiKey,
        "accept": "application/json",
      },
    });

    const demographicsData = await demographics.json();
    console.log('demographicsData ', demographicsData);
    const demographicsList = demographicsData.results.demographics || [];

    const demographicsMap: Record<string, { age: Record<string, number>, gender: Record<string, number> }> = {};
    for (const demographic of demographicsList) {
      const age = demographic.query.age;
      const gender = demographic.query.gender;

      demographicsMap[demographic.entity_id] = { age, gender };
    }

    function addDemographics(arr: Record<string, any>[]) {
      return arr.map(entity => {
        const id = entity.id || entity.entity_id;
        const demo = demographicsMap[id];
        if (demo) {
          return { ...entity, ...demo };
        }
        return entity;
      });
    }
    const entitiesWithDemo = addDemographics(entities);
    const reccomendedEntitiesWithDemo = addDemographics(reccomendedEntities.filter(Boolean) as Record<string, any>[]);


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
        console.log("entity.age = ", entity.age);
        for (const [ageKey, value] of Object.entries(entity.age)) {
          console.log("ageKey = ", ageKey);
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
      reccomendedEntities: reccomendedEntitiesWithDemo,
      ageTotals: roundObj(ageTotals),
      genderTotals: roundObj(genderTotals),
    }
    console.log("newAudience = ", newAudience);

    // add audience to user audience sub collection
    await db.collection("users").doc(uid).collection("audiences").doc().set(newAudience);

    return NextResponse.json({...newAudience});
}