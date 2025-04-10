export interface Section {
  sectionId: string
  designation: string
  code: string
  role: string
  dateDebut: string
  _id?: string
  bureaux?: Array<{
    agentId: string
    grade: string
  }>
  jurys?: Array<any>
  offres?: Array<any>
  description?: string
  titre?: string
  email?: string
  telephone?: string
  url?: string
}

export interface SectionsResponse {
  success: boolean
  data: Section[]
  message: string
}