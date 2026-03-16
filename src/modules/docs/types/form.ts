import type { MultiSelectOption }  from "@/components/ui/MultiSelectInput.vue";


export type CreateDocFormErrors = {
    documentName: boolean
    recipientId: boolean
}

export type CreateDocForm = {
    documentName: string
    recipientId: number
    approversSelectedOptions: MultiSelectOption[]
    file: File
    errors: CreateDocFormErrors
}

export type CreateDocForm107Errors = {
    tripDateStart: boolean
    tripDateEnd: boolean
    fundingSource: boolean
    tripPurpose: boolean
}

export interface Destination {
    full_address: string;
    organization: string;
    date_start: string;
    date_end: string;
}

export type CreateDocForm107 = {
    tripDateStart: string
    tripDateEnd: string
    fundingSource: number
    tripPurpose: string
    vice?: string;
    destinations: Destination[];
}
