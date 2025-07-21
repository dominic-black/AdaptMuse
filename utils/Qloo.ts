import { Entity } from "@/types/entity";

export const getEntityContent = async (query: string, type: string): Promise<Entity | null> => {
    const qlooApiKey = process.env.QLOO_API_KEY;
    console.log("qlooApiKey", qlooApiKey);
    if (!qlooApiKey) return null;
    
    try{
        const url = `https://hackathon.api.qloo.com/search?types=${type}&query=${encodeURIComponent(query)}&take=2`;
        console.log("url", url);
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-api-key": qlooApiKey,
            },
        });
        console.log("response", response);
        const data = await response.json();
        console.log("data", data);
        if(data.results.length === 0) return null;

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
        }

        console.log("outputEntity", outputEntity);
        return outputEntity;
    }catch(error){
        console.error("Error calling Qloo API", error);
        return null;
        }
};  
