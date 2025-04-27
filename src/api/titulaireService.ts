import api from "@/api/config";
import { put } from "@vercel/blob";


interface ApiResponse<T> {
  success: boolean
  count: number
  data: T,
  message?: string
}

interface MatiereInfo {
  _id: string
  designation: string
  code: string
}

interface Travail {
  _id: string
  title: string
  description: string
  dateDebut: Date
  dateFin: Date
  matiereId: string
  auteurId: string
  questions?: any[]
}

interface TravailResponse extends Omit<Travail, 'matiereId'> {
  matiereId: MatiereInfo
}

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

    async getAllTravauxByAuteurId(titulaireId: string) {
        try {
            const resp = await fetch(`${api.API}travaux?auteurId=${titulaireId}`);

            const response: any[] = await resp.json();
                      
            return response;
        } catch (error) {
            console.error("Erreur lors de la récupération des travaux:", error);
            throw error;                        
        }
    }

    async getCommandesByTravailId(travailId: string) {
        try {
            const resp = await fetch(`${api.API}travaux/commandes/${travailId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response: ApiResponse<any[]> = await resp.json();
            if (!resp.ok) {
                throw new Error(response.message || 'Une erreur est survenue');
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des commandes:", error);
            throw error;            
        }
    }

    async getAllTravauxByCharge(matiereId: string, auteurId: string) {
        try {
            const resp = await fetch(`${api.API}titulaire/travaux/${matiereId}/${auteurId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response: ApiResponse<TravailResponse[]> = await resp.json();
            
            if (!resp.ok) {
                throw new Error(response.message || 'Une erreur est survenue');
            }

            // Transform the response to match our Travail type
            const transformedData = response.data.map(travail => ({
                ...travail,
                matiereId: travail.matiereId._id,
                matiere: {
                    designation: travail.matiereId.designation,
                    code: travail.matiereId.code
                }
            }));

            return transformedData;
        } catch (error) {
            console.error("Erreur lors de la récupération des travaux:", error);
            throw error;            
        }
    }

    async createTravail(travail: any) {
        try {
            const resp = await fetch(`${api.API}titulaire/travaux`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(travail),
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création du travail:", error);
            throw error;            
        }
    }

    async getTravailById(travailId: string) {
        console.log("Travail ID:", travailId);
        try {
            const resp = await fetch(`${api.API}titulaire/travaux/${travailId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        }
        catch (error) {
            console.error("Erreur lors de la récupération du travail:", error);
            throw error;            
        }
    }

    async createQuestion(question: any, travailId: string) {
        try {
            const resp = await fetch(`${api.API}titulaire/${travailId}/questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(question),
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création de la question:", error);
            throw error;            
        }
    }

    async updateQuestion(questionId: any, travailId: string, data:any) {
        try {
            const resp = await fetch(`${api.API}titulaire/${travailId}/questions/${questionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la question:", error);
            throw error;            
        }
    }

    async updateTravail(travailId: string, data:any) {
        try {
            const resp = await fetch(`${api.API}titulaire/travaux/${travailId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du travail:", error);
            throw error;            
        }
    }

    async deleteTravail(travailId: string) {
        try {
            const resp = await fetch(`${api.API}titulaire/travaux/${travailId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
            
        } catch (error) {
            console.error("Erreur lors de la suppression du travail:", error);
            throw error;            
            
        }
    }

    async saveBlob(file: File, fileName: string) {
        try {
            const blob = await put(fileName, file, {
                access: 'public',
                token: 'vercel_blob_rw_UjimgJlxAOXHk6Kc_diCCt7m888bwt2Wsj1JMW9zEAbVKH6',
            });
            console.log(blob);

            const url = blob.url;
            return url;
        } catch (error) {
            
        }
    }

    // Coté la resolution d'un etudiant
    async setCoteResolution(resolutionId: string, data:{note: number, comment: string}) {
        try {
            const resp = await fetch(`${api.API}resolution/${resolutionId}/note`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la resolution:", error);
            throw error;            
        }
    }

    // Resolutions des étudiants à un travail
    async getResolutionsByTravailId(travailId: string) {
        try {
            const resp = await fetch(`${api.API}resolution/travail/${travailId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des resolutions:", error);
            throw error;            
        }
    }

    // Modifier une resolution
    async updateResolution(resolutionId: string, data:any) {
        try {
            const resp = await fetch(`${api.API}resolution/${resolutionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la resolution:", error);
            throw error;            
        }
    }

    // Supprimer une resolution
    async deleteResolution(resolutionId: string) {
        try {
            const resp = await fetch(`${api.API}resolution/${resolutionId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression de la resolution:", error);
            throw error;            
        }
    }

    // Noter un étudiant
    async createNoteEtudiant(data : 
        {
            anneeId: string, 
            etudiantId: string, 
            matiereId: string, 
            createdBy: string,
            noteAnnuel?: number,
            noteExamen?: number,
            noteRattrapage?: number,
        }
    ) {
        try {
            const resp = await fetch(`${api.API}titulaire/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création de la note:", error);
            throw error;            
            
        }
    }

    // Modifier une note
    async updateNoteEtudiant(noteId: string, data:any) {
        try {
            const resp = await fetch(`${api.API}titulaire/notes/${noteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la note:", error);
            throw error;            
        }
    }
    
    // Supprimer une note
    async deleteNoteEtudiant(noteId: string) {
        try {
            const resp = await fetch(`${api.API}titulaire/notes/${noteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression de la note:", error);
            throw error;            
        }
    }

    // Obtenir les notes d'un étudiant
    async getNotesByEtudiantId(anneeId: string, etudiantId: string) {
        try {
            const resp = await fetch(`${api.API}titulaire/notes/${anneeId}/${etudiantId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des notes:", error);
            throw error;            
        }
    }

    // Créer un retrait
    async createRetrait(data: { montant: number, type: string, description: string, agentId: string }) {
        try {
            const resp = await fetch(`${api.API}retraits/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const response = await resp.json();
            if (!resp.ok) {
                throw new Error(response.error);
            }
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création du retrait:", error);
            throw error;            
        }
    }

    // Obtenir les retraits d'une section
    async retraitsByAgnetId(agentId: string) {
        try {
            const resp = await fetch(`${api.API}retraits/agent/${agentId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const response = await resp.json();
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.stats;
        } catch (error) {
            console.error("Erreur lors de la récupération des retraits:", error);
            throw error;            
        }
    }

}

export default new TitulaireService();