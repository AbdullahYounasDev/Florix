export const ImageAnalysis = async (imageData: any, prompt: any) => {
     try {
      console.log('Image start processing')
        const result = await fetch("https://florix-backend.vercel.app/api/v1/ai/getImageAnalysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ imageData, prompt })
        });

        return result.json()
     } catch (error) {
        console.log(error)
        throw new Error("Image analysis API failed");
     }
}