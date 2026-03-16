import {TravelFundingSource} from "../types/doc";
import {travelFundingSources} from "../api/docs.api";

export const loadTravelFundingSourcesOptions = async (lang: string) => {
    try {
        const { data } = await travelFundingSources(lang)

        return data
            .map((fundingSource: TravelFundingSource) => ({
                value: fundingSource.id,
                label: `${fundingSource.name ?? ''}`.trim(),
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) // сортировка по алфавиту
    } catch (error) {
        return []
    }
}
