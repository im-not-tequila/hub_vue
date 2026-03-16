import {Vice} from "@/types/user";
import {vices} from "@/api/user.api";

export const loadViceOptions = async (structural_subdivision_id: number) => {
    try {
        const { data } = await vices(structural_subdivision_id)

        return data
            .map((vice: Vice) => ({
                value: vice.platonus_id,
                label: `${vice.shortname ?? ''}`.trim(),
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) // сортировка по алфавиту
    } catch (error) {
        return []
    }
}
