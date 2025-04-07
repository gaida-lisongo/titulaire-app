import api from "@/api/config";
class AuthService {
    async login({
        matricule
    }:{
        matricule: string
    }) {
        console.log("login", matricule);
        const response = await fetch(`${api.API}agents/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                matricule
            }),
        });
        console.log(response);
        return response.json();
    }

    async verifyOtp({
        id,
        otp
    }: {id: string, otp: string}) {
        const response = await fetch(`${api.API}agents/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                otp
            }),
        });
        return response.json();
    }

    async isMemberSection({
        id}: {id: string}) {
        const response = await fetch(`${api.API}sections/agent/${id}/sections`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    async getAllSections() {
        const response = await fetch(`${api.API}sections`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }
}

export default new AuthService();