export interface StructuralSubdivision {
    id: number
    name_ru: string
    name_kz: string
}


export interface User {
    id: number
    firstname: string
    lastname: string
    patronymic: string | null
    shortname: string
    subdivision_id: number
    structural_subdivision: StructuralSubdivision
    post: string | null
    is_dean: boolean
}


export interface Vice {
    platonus_id: number
    lastname: string
    firstname: string
    patronymic: string
    shortname: string
}

