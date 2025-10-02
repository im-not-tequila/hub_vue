import { allTutorsWithPosition } from '../api/docs.api'
import { TutorWithPosition } from '../types/doc'

export const loadTutorsWithPositionOptions = async () => {
    try {
        const { data } = await allTutorsWithPosition()

        return data
            .map((tutor: TutorWithPosition) => ({
                value: tutor.tutor_id,
                label: `${tutor.position_name ?? ''} - ${tutor.lastname ?? ''} ${tutor.firstname ?? ''} ${tutor.patronymic ?? ''}`.trim(),
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) // сортировка по алфавиту
    } catch (error) {
        console.error('Ошибка при загрузке преподавателей:', error)
        return []
    }
}
