import api from "@/api/config";

class AgentService {
    async changeUserInfo({
        id,
        data
    }: {
        id: string;
        data: any;
    }) {
        const response = await fetch(`${api.API}agents/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();

    }

    async uploadImage(file: File): Promise<string> {
      // Code existant pour l'upload sur Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', api.CLOUDINARY.CLOUDINARY_UPLOAD_PRESET);
      
      console.log('Uploading to Cloudinary...', file.name);
      
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${api.CLOUDINARY.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.secure_url) {
          throw new Error("L'URL de l'image n'a pas été retournée par Cloudinary");
        }
        
        console.log('Cloudinary response:', data.secure_url);
        
        return data.secure_url;
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
      }
    }

}

export default new AgentService();
