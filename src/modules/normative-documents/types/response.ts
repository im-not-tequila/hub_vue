export interface NormativeDocumentSubcategory {
  id: number
  name: string
}

export interface NormativeDocumentCategory {
  id: number
  name: string
  subcategories?: NormativeDocumentSubcategory[]
}

export interface NormativeDocumentItem {
  id: number
  name: string
  category_id: number
  subcategory_id: number
}
