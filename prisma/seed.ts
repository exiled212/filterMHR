import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';
const db = new PrismaClient();

async function seed() {
    await createSkills();
    await createJewels();
}

seed();

async function createSkills (){
    const skillFromDb = await Promise.all(
        getSkills().map((skill)=>{
            return db.skill.findUnique({where:{name:skill.name}})
        })
    );
    const skillNames = skillFromDb.filter(row=>row).map(row=>row.name);
    const insertRows = getSkills().filter((skill)=>!skillNames.includes(skill.name));

    await Promise.all(
        insertRows.map((skill)=>{
            return db.skill.create({data:skill});
        })
    );
}

async function createJewels(){
    const jewelsDB = await Promise.all(
        getJewels().map((jewel)=>{
            return db.jewel.findUnique({where: {name: jewel.name}})
        })
    );
    const jewelNames = jewelsDB.filter(row=>row).map(row=>row.name);
    const insertRows = getJewels().filter((skill)=>!jewelNames.includes(skill.name));
    
    await Promise.all(
        insertRows.map(async (row)=>{
            let skill: Skill = await db.skill.findUnique({where: {name: row.skill_name}})
            return db.jewel.create({data: {
                name: row.name,
                es: row.es,
                skill_id: skill.id
            }});
        })
    );

}

function getSkills() {
    const fileData = fs.readFileSync(path.join('.', 'data', 'skills.json'), {encoding:'utf8', flag: 'r'});
    return JSON.parse(fileData) as Skill[];
}

function getJewels() {
    const fileData = fs.readFileSync(path.join('.', 'data', 'jewels.json'), {encoding:'utf8', flag: 'r'});
    return JSON.parse(fileData) as Jewel[];
}

type Skill = {
    id?: number,
    name: string,
    es?: string
}

type Jewel = {
    name: string,
    es?: string,
    skill_name: string
}