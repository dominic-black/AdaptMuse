import { NextRequest, NextResponse } from 'next/server';
import { EntityTypes } from '@/constants/entity';

export async function POST(request: NextRequest) {
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

      const entityData = await fetch(`https://hackathon.api.qloo.com/v2/insights?filter.type=${EntityTypes[key as keyof typeof EntityTypes]}&signal.demographics.gender=${gender}&signal.interests.entities=${entities.map(e => e.id).join(",")}&signal.demographics.audiences=${audiences.join(",")}&signal.demographics.age=${ageGroup}`, {
        headers: {
          "x-api-key": qlooApiKey,
          "accept": "application/json",
        },
      });
      const data = await entityData.json();

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

    const demographicsMap: Record<string, { averageAge: Record<string, number>, averageGender: Record<string, number> }> = {};
    for (const demographic of demographicsList) {
      const age = demographic.query.age;
      const gender = demographic.query.gender;

      const averageAge: Record<string, number> = {};
      for (const key in age) {
        averageAge[key] = age[key];
      }

      const averageGender: Record<string, number> = {};
      for (const key in gender) {
        averageGender[key] = gender[key];
      }

      demographicsMap[demographic.entity_id] = { averageAge, averageGender };
    }

    function addDemographics(arr: any[]) {
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
    const reccomendedEntitiesWithDemo = addDemographics(reccomendedEntities);

    return NextResponse.json({
      entities: entitiesWithDemo,
      reccomendedEntities: reccomendedEntitiesWithDemo,
    });
}