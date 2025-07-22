export interface AudienceOption {
    label: string;
    value: string;
}

export const AUDIENCE_OPTIONS: Record<string, AudienceOption[]> = {
    SPENDING_HABITS: [
        {
            label: "7553AEF3-0213-4419-8C17-E4CDF28B2BB0",
            value: "Vintage Apparel",
        },
        {
            label: "F9619A04-A80C-4FB8-BBD4-7E653E31075F",
            value: "Technology Enthusiast",
        },
        {
            label: "B966ABDA-92B7-4C91-B598-C65CE6013C9B",
            value: "Watch Collecting",
        },
        {
            label: "F66B9D4E-1503-4BA1-8ABB-745652CA2A12",
            value: "Boutique Hotels",
        },
        {
            label: "B374F423-E1E6-4783-AA1E-48A6B2B5635F",
            value: "Discount Shoppers",
        },
        {
            label: "ED8798A4-1EB1-4E53-80EA-4FD08BD3C148",
            value: "Gourmand Fine Dining",
        }
    ],
    POLITICAL_PREFERENCES: [
        {
            label: "B3A035FD-0D99-4980-98FD-A5B81D7E402A",
            value: "Politically Progressive",
        },
        {
            label: "A2F107FD-2A38-4100-AFFB-037A6A2DF338",
            value: "Politically Center",
        },
        {
            label: "555258C9-2696-496A-B1C1-C46A6F7795C8",
            value: "Politically Conservative",
        }
    ],
    LIFESTYLE_PREFERENCES_BELIEFS: [
        {
            label: "5F4CF648-08CD-4031-A17E-491E90A4DD4C",
            value: "Astrology",
        },
        {
            label: "D3839B31-2A5F-4DA3-8C04-528D9611039E",
            value: "Organic Ingredients",
        },
        {
            label: "2A7B1369-BF0D-46E2-AAEE-780817162FF4",
            value: "Christianity",
        },
        {
            label: "F854077D-E466-4181-A7E4-4CDA52981EA2",
            value: "Healthy Eating",
        },
        {
            label: "399883E7-F468-4BD6-9209-91DAD7BF3537",
            value: "Judaism",
        },
        {
            label: "7819CC7E-FEAF-4FC6-B0D8-EFED92CD46AE",
            value: "Veganism",
        },
        {
            label: "439B29E4-F9B2-4FA7-8095-123F6833DE5F",
            value: "Spirituality",
        },
        {
            label: "87A86EE9-5CA0-4C1F-8237-E3EE73C72281",
            value: "Islam",
        }
    ],
    LIFE_STAGES: [
        {
            label: "22D0A7AF-7833-49F3-8E36-42E8D91EEC8B",
            value: "Parents With Young Children",
        },
        {
            label: "DBF3D836-74E1-4A50-BAF7-6F3426ADA64A",
            value: "Engaged",
        },
        {
            label: "61419C52-AA82-48FB-A68E-F873A417E040",
            value: "Single",
        },
        {
            label: "B88B7B93-BD33-4910-B44E-24B06C6C8164",
            value: "Retirement",
        }
    ],
    LEISURE_INTERESTS: [
        {
            label: "539308D1-B0B5-4C9D-8B67-E7B565B59B09",
            value: "Political Junkie",
        },
        {
            label: "AAF408EF-5947-4035-BD34-6678F4A94994",
            value: "Arts Culture",
        },
        {
            label: "F86C9FE1-16D1-4CFA-8E33-77AD4FEDBB60",
            value: "Foodie",
        },
        {
            label: "D1F0EE4A-FDB3-48DC-919C-5A94F3D4EC85",
            value: "Cooking",
        },
        {
            label: "8371AF94-2F4C-4139-BC87-E3FBEA695D88",
            value: "Museums",
        },
        {
            label: "AB40A444-E528-43FE-BE78-E014301CFD80",
            value: "Cinephile",
        },
        {
            label: "61D4EAAB-8591-4CCC-BEFC-5F0D18C4F3BD",
            value: "Music Festivals",
        },
        {
            label: "2EFF1AB9-814F-48D2-B2DE-D418ED8385AE",
            value: "Avid Reader",
        },
        {
            label: "E1C2F640-4C29-4F79-AD75-82CDE3DB4622",
            value: "Exercising",
        },
        {
            label: "AFA24856-F432-40E3-AADF-C939A033F77E",
            value: "Coffee",
        },
        {
            label: "3A9990DA-AA86-4934-AC8D-4088E91700AA",
            value: "News Junkie",
        }
    ],
    INVESTING_INTERESTS: [
        {
            label: "1B2E2B7F-2FF5-495F-9389-FD4D35A03144",
            value: "Stocks Bonds",
        },
        {
            label: "2C606C12-C64F-46B1-BAE6-4FB0C278E612",
            value: "Angel Start Up Investing",
        },
        {
            label: "2248A93C-17C0-4BCD-A671-19DB6BDB98D3",
            value: "Real Estate",
        },
        {
            label: "35DD51F5-4C89-436D-9A36-1C6BDD1D1508",
            value: "NFT Collectors",
        },
        {
            label: "C11DC8FF-5EDC-4B64-9504-1CD64C1B10FA",
            value: "Cryptocurrency Enthusiasts",
        },
        {
            label: "42D6F3D0-AD4A-4AC8-B3EE-229775638336",
            value: "Art Collectibles",
        }
    ],
    HOBBIES_AND_INTERESTS: [
        {
            label: "8F0407D3-64F3-47BF-A6B1-BA4C30465F71",
            value: "Health And Beauty",
        },
        {
            label: "DBDCB7B7-B015-425F-9C3E-619C9C4245EB",
            value: "Adventuring",
        },
        {
            label: "7DCA3589-E6FF-4582-BE24-5A2D09D71336",
            value: "Photography",
        },
        {
            label: "965CD575-A0AD-4128-88B6-DE0C599D644F",
            value: "Tattoos",
        },
        {
            label: "1C3735D4-FE2D-4CDE-811A-9B2BFE767DAD",
            value: "Meditation",
        },
        {
            label: "1CA32D17-6D03-453C-8B91-12B4604076E1",
            value: "Hockey",
        },
        {
            label: "31C1423A-6A88-4028-ADEC-C3042BE765B9",
            value: "American Football",
        },
        {
            label: "663BAA0C-44CF-4794-8827-E36FBEF3E5F5",
            value: "Martial Arts",
        },
        {
            label: "EEFA88EB-0D5D-4290-B0AB-F7840DE970DB",
            value: "Running",
        },
        {
            label: "471BEA15-6E9F-4347-B3DF-46E4A6045B8E",
            value: "Secret Unravelers",
        },
        {
            label: "107AE5DB-906C-430C-969E-3886C39BDD8C",
            value: "Motorcycles",
        },
        {
            label: "ED9B04EF-C693-44C8-82DE-C2B138710601",
            value: "Jewellery",
        },
        {
            label: "73B662F7-7DB7-4D0C-A36B-2E8E75ACDF49",
            value: "Hiking",
        },
        {
            label: "40A2CD3E-0A56-4341-9996-9EF819D39398",
            value: "Watches",
        },
        {
            label: "174B1FE8-CDCE-4896-ADF5-E59981B9AE95",
            value: "Spy Enthusiast",
        },
        {
            label: "604A723B-3E2C-4795-89AA-DF5BA0C3B3C5",
            value: "Arts Crafts",
        },
        {
            label: "FE2A1718-8970-46D1-947F-D23B199F906D",
            value: "Wrestling",
        },
        {
            label: "9130A837-ED3C-4BA9-9825-5D0D57D119CD",
            value: "Home Organization",
        },
        {
            label: "D4B24E84-C439-4D7C-B2DC-92F7C704DE76",
            value: "Sneakerheads",
        },
        {
            label: "7CB916B9-1D27-4D76-8D97-2CC5950385CA",
            value: "Travel",
        },
        {
            label: "566BE3C4-C712-4B76-916D-2EFC0D26BD81",
            value: "Golf",
        },
        {
            label: "FA88A1F6-8CEF-4F6A-8FD1-FE7A739052D7",
            value: "High Fashion",
        },
        {
            label: "7F86E72A-AF3C-4AA9-B125-7155E9261466",
            value: "Home Decor",
        },
        {
            label: "1F3BBF4D-D14C-4C1D-B9BD-8F8CDCEA55FA",
            value: "Street Fashion",
        },
        {
            label: "803132BB-07E8-4D55-A37D-8B9EFB3E095F",
            value: "Video Gamer",
        },
        {
            label: "689CB6FD-E1A9-4B06-9932-3093B8F61A97",
            value: "Tennis",
        },
        {
            label: "7A1AEC8A-06B4-4834-B1E1-FD45648D9BE3",
            value: "Swimming",
        },
        {
            label: "F8369494-BD42-4DA1-A056-2315241E2401",
            value: "Automotive",
        },
        {
            label: "15D9D8DF-28AF-425A-AF2E-835DFB53E778",
            value: "Musician",
        },
        {
            label: "7010BFFD-33F5-460C-8660-3E49C570FF47",
            value: "Perfume",
        },
        {
            label: "E7EC95B5-91D3-4B36-90CD-868680D13C93",
            value: "Casual Escapists",
        },
        {
            label: "9D36D8C6-B39C-48AE-87A6-F63E59328577",
            value: "Racing",
        },
        {
            label: "1D7AF41D-8ECF-414C-B6C9-7CA9FA276DBD",
            value: "Adrenaline Rushers",
        },
        {
            label: "8C44B7FB-384C-445D-8FB0-01AD0BB54248",
            value: "Soccer",
        },
        {
            label: "F488B2E4-21FE-4AFA-8B2E-0DA5A0F4E756",
            value: "Yoga",
        },
        {
            label: "E8694D82-FE70-4EA5-A87B-53B90607EA75",
            value: "Baseball",
        },
        {
            label: "67A1B149-175D-4005-85E1-C0A395A1FA4F",
            value: "Architecture",
        },
        {
            label: "14F62034-5661-4B52-822B-D2D88A3D1B02",
            value: "Wine Enthusiast",
        },
        {
            label: "53E66B25-2B9E-4821-8257-65F66B62DD80",
            value: "Basketball",
        },
        {
            label: "AAAE9FAA-FE3D-4732-9E82-BD4CED485D60",
            value: "Outdoors",
        },
        {
            label: "2D160ADC-1673-4D12-9530-D6E78DE07087",
            value: "Fishing",
        },
        {
            label: "1B095F7B-1A06-4F65-AE32-BB9E9EAC26D6",
            value: "Dance",
        }
    ],
    COMMUNITIES: [
        {
            label: "DA61B8AD-6D79-4B0C-BEA0-EC966C93902E",
            value: "AAPI",
        },
        {
            label: "E47478B9-8ED2-449B-B854-6344059742E3",
            value: "Latino",
        },
        {
            label: "6BED625C-E312-47E9-A4B5-F978C7778269",
            value: "LGBTQ",
        },
        {
            label: "A8A43978-5291-46DC-8952-D58EDC7FF82B",
            value: "Black",
        }
    ],
    GLOBAL_ISSUES: [
        {
            label: "FB61D98E-C4BA-4959-A571-0861FD2AC850",
            value: "Climate Activism",
        },
        {
            label: "B7970242-69CC-40FB-AFB6-0A5781E613DB",
            value: "Gender Equality",
        },
        {
            label: "9D25E87E-030C-4EE7-B049-F24967AAD596",
            value: "Racial Justice",
        },
        {
            label: "616F4741-3864-41FD-BFCF-49B76AA025C8",
            value: "Education Issues",
        },
        {
            label: "BAC54F13-A15E-49E8-A645-BCACD5683B14",
            value: "Ocean Health",
        },
        {
            label: "1EFF8636-B50C-4B57-86DD-6CB2D4F8F397",
            value: "Foreign Affairs",
        },
        {
            label: "C956BAAF-4449-4B0B-BCA1-D3B06644B165",
            value: "Wealth Inequality",
        },
        {
            label: "784D31A2-99A5-4E8C-8B89-047B01760CC2",
            value: "Animal Issues",
        },
        {
            label: "B48DAA8A-7398-4C76-9DB0-80E12669ABFD",
            value: "Mental Health",
        },
        {
            label: "109574B3-A21D-4935-AC94-1DC3C7B56BEC",
            value: "Sustainability",
        },
        {
            label: "2EE4FA44-9A90-470F-839F-2CF54A273E59",
            value: "Fair Wages",
        }
    ]
};