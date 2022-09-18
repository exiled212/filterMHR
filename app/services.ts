import { db } from "~/utils/db.server";
import type { JewelDB, Jewel } from "./types";

export const getData = async () => {

    let jewels = await db.jewel.findMany({
        include: { skill: true },
        orderBy: [ { name: 'asc' }]
    });

    return jewels.map((row: JewelDB)=>({
        id: row.id,
        name: row.name,
        es: row.es,
        skill_name: row.skill.name,
        skill_es: row.skill.es
    } as Jewel));
}

export const updateJewel = async (id: string, values: any) => {
    await db.jewel.update({
        where: { id: Number(id) },
        data: values
    });
}

export const updateSkill = async (id: string, values: any) => {
    const idNumber = Number(id);
    const jewel = await db.jewel.findUnique({where:{id: idNumber}});
    if(jewel && jewel.skill_id){
        await db.skill.update({
            where: {
                id: jewel.skill_id
            },
            data: values
        });
    }
}


export const getHeaders = async () => {
    return [
        {
          headerName: 'Jewel',
          field: 'name', 
          width: 200,
          editable: true
       },
       {
          headerName: 'Joya', 
          field: 'es', 
          width: 200,
          editable: true
       },
       {
          headerName: 'Skill',
          field: 'skill_name', 
          width: 200,
          editable: true
       },
       {
          headerName: 'Habilidad',
          field: 'skill_es', 
          width: 200,
          editable: true
       }
    ];
}