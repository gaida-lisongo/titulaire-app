import api from "@/api/config";

class TitulaireService {
    async getChargesHoraireByTitulaireId(titulaireId: string) {
        const response = await fetch(`${api.API}titulaire/charges/${titulaireId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    };

    async getAnneeAcademique(id: string) {
        const response = await fetch(`${api.API}annees/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }
}

export default new TitulaireService();