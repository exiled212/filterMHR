export type Jewel = {
    id: number
    name: string
    es?: string
    skill_name: string,
    skill_es?: string
}

export type JewelDB = {
    id: number
    name: string
    es?: string
    skill_id: number
    skill: SkillDB
}

export type SkillDB = {
    id: number
    name: string
    es?: string
}