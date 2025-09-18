export interface TutorWithPosition {
    tutor_id: number
    lastname: string | null
    firstname: string | null
    patronymic: string | null
    position_name: string | null
}

export type AllTutorsWithPositionResponse = TutorWithPosition[]
