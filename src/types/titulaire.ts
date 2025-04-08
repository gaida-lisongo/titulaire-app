export interface ChargeHoraire {
    id: string
    matiere: string
    heures: number
    promotion: string
    anneeAcademique: string
}

export interface TitulaireState {
    chargesHoraire: ChargeHoraire[]
    isLoading: boolean
    error: string | null
}