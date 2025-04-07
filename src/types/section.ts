export interface Section {
  sectionId: string
  designation: string
  code: string
  role: string
  dateDebut: string
}

export interface SectionsResponse {
  success: boolean
  data: Section[]
  message: string
}