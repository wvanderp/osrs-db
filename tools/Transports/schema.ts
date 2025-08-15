interface Transport {
    name: string;
    origin: Origin;

    destinations: {
        coordinates: [number, number, number];
        menuOptions?: string;
    }[]

    requirements: Requirement[];
}

// -------------

type Origin = NPCOrigin | ItemOrigin | ObjectOrigin;

interface baseOrigin {
    coordinates: [number, number, number];
}

interface NPCOrigin extends baseOrigin {
    type: "NPC";
    NPCid: number;
}

interface ItemOrigin extends baseOrigin {
    type: "Item";
    itemID: number;
}

interface ObjectOrigin extends baseOrigin {
    type: "Object";
    ObjectID: number;
}

// -------------

type Requirement = SkillRequirement | ItemRequirement | RuneRequirement | QuestRequirement | VarbitRequirement;

interface baseRequirement {

}

interface SkillRequirement extends baseRequirement {
    id: number;
    level: number;
}

interface ItemRequirement extends baseRequirement {
    id: number;
    quantity: number;
}

interface RuneRequirement extends baseRequirement {
    id: number;
    quantity: number;
}

interface ObjectRequirement extends baseRequirement {
    id: number;
    quantity: number;
}

interface QuestRequirement extends baseRequirement {
    id: number;
    completed: boolean;
}

interface VarbitRequirement extends baseRequirement {
    id: number;
    value: number;
}
