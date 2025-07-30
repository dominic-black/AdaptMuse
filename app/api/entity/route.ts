import { NextRequest, NextResponse } from 'next/server';
import { Entity } from '@/types/entity';
import { withAuth } from '@/lib/authMiddleware';
import { AuthenticatedUser } from '@/types';
import { EntityTypes } from '@/constants/entity';

const ALLOWED_ENTITY_TYPES = Object.values(EntityTypes);

export const GET = withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  const query = request.nextUrl.searchParams.get('query');
  const type = request.nextUrl.searchParams.get('type');
  const qlooApiKey = process.env.QLOO_API_KEY;

  if (!qlooApiKey || !query || typeof query !== 'string' || !type || !ALLOWED_ENTITY_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Missing or invalid query or type' }, { status: 400 });
  }

  try {
    const url = `https://hackathon.api.qloo.com/search?types=${type}&query=${encodeURIComponent(query)}&take=2`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "x-api-key": qlooApiKey },
    });
    const data = await response.json();
    if (data.results.length === 0) {
      return NextResponse.json({ entity: null });
    }

    const entity = data.results[0];
    let subText = "";
    switch(type) {
      case "urn:entity:movie":
          subText = entity.properties.release_date;
          break;
      case "urn:entity:person":
          subText = entity.properties.short_description;
          break;
      case "urn:entity:artist":
          subText = entity.properties.short_description;
          break;
      case "urn:entity:book":
          subText = entity.properties.publication_date;
          break;
      case "urn:entity:brand":
          subText = entity.properties.short_description;
          break;
      case "urn:entity:place":
          subText = entity.properties.addrss;
          break;
      case "urn:entity:tv_show":
          subText = entity.properties.release_date;
          break;
      case "urn:entity:videogame":
          subText = entity.properties.publisher;
          break;
      case "urn:entity:destination":
          subText = entity.properties.short_description;
          break;
  }
    const outputEntity: Entity = {
      id: entity.entity_id,
      name: entity.name,
      subText,
      popularity: entity.popularity,
      type,
      imageUrl: entity.properties?.image?.url || "location-img",
    };

    return NextResponse.json({ entity: outputEntity });
  } catch (error) {
    console.error("Error calling Qloo API", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
