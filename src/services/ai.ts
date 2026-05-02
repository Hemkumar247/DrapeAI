import { GoogleGenAI, Type } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY1 || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in the secrets menu.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export type GarmentAnalysisResult = {
  is_valid_apparel: boolean;
  rejection_reason: string | null;
  garment_type: string;
  sub_type: string;
  primary_colors: string[];
  pattern: string;
  fit: string;
  length: string | null;
  style_category: string;
  fabric_guess: string;
  season: string;
  detected_brand: string | null;
  quality_score: number;
  notes: string;
};

export async function analyzeGarment(imageBase64: string, mimeType: string = "image/jpeg"): Promise<GarmentAnalysisResult> {
  const ai = getAI();
  const prompt = `Analyze this apparel image and return a JSON object with exactly these fields:
{
  "is_valid_apparel": true,
  "rejection_reason": null,
  "garment_type": "dress | top | bottom | pants | skirt | jacket | coat | suit | jumpsuit | other",
  "sub_type": "midi dress | crop top | wide-leg pants | etc",
  "primary_colors": ["color1", "color2"],
  "pattern": "solid | stripes | floral | plaid | abstract | graphic | animal print | other",
  "fit": "slim | regular | oversized | fitted | relaxed",
  "length": "mini | midi | maxi | cropped | full | knee-length | null",
  "style_category": "casual | formal | streetwear | workwear | athleisure | evening | resort",
  "fabric_guess": "cotton | denim | silk | linen | knit | leather | synthetic | unknown",
  "season": "summer | winter | all-season | layering piece",
  "detected_brand": "brand name or null",
  "quality_score": 0.87,
  "notes": "any important visual detail that affects try-on accuracy"
}
If is_valid_apparel is false, populate rejection_reason with: "no_garment_detected" | "multiple_garments_no_focus" | "garment_already_on_person" | "image_too_blurry" | "image_too_small" | "nsfw_content"`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { inlineData: { data: imageBase64.split(",")[1] || imageBase64, mimeType } },
      prompt
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          is_valid_apparel: { type: Type.BOOLEAN },
          rejection_reason: { type: Type.STRING, nullable: true },
          garment_type: { type: Type.STRING },
          sub_type: { type: Type.STRING },
          primary_colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          pattern: { type: Type.STRING },
          fit: { type: Type.STRING },
          length: { type: Type.STRING, nullable: true },
          style_category: { type: Type.STRING },
          fabric_guess: { type: Type.STRING },
          season: { type: Type.STRING },
          detected_brand: { type: Type.STRING, nullable: true },
          quality_score: { type: Type.NUMBER },
          notes: { type: Type.STRING }
        },
        required: ["is_valid_apparel", "garment_type", "primary_colors"]
      }
    }
  });

  return JSON.parse(response.text?.trim() || "{}");
}

export type UserPhotoValidationResult = {
  usable_for_tryon: boolean;
  rejection_reason: string | null;
  user_tip: string | null;
  full_body_visible: boolean;
  pose: string;
  lighting_quality: string;
  background_complexity: string;
  single_person: boolean;
  is_minor_detected: boolean;
  has_heavy_filter: boolean;
  estimated_photo_quality: number;
};

export async function validateUserPhoto(imageBase64: string, mimeType: string = "image/jpeg"): Promise<UserPhotoValidationResult> {
  const ai = getAI();
  const prompt = `Validate this full-body photo for virtual try-on use. Return this exact JSON:
{
  "usable_for_tryon": true,
  "rejection_reason": null,
  "user_tip": null,
  "full_body_visible": true,
  "pose": "standing | sitting | walking | crouching | other",
  "lighting_quality": "good | acceptable | poor",
  "background_complexity": "plain | moderate | complex",
  "single_person": true,
  "is_minor_detected": false,
  "has_heavy_filter": false,
  "estimated_photo_quality": 0.88
}
rejection_reason: "partial_body" | "group_photo" | "poor_lighting" | "heavy_filter" | "motion_blur" | "low_resolution" | "minor_detected" | "extreme_pose" | null
user_tip: short actionable sentence under 12 words, or null`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { inlineData: { data: imageBase64.split(",")[1] || imageBase64, mimeType } },
      prompt
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          usable_for_tryon: { type: Type.BOOLEAN },
          rejection_reason: { type: Type.STRING, nullable: true },
          user_tip: { type: Type.STRING, nullable: true },
          full_body_visible: { type: Type.BOOLEAN },
          pose: { type: Type.STRING },
          lighting_quality: { type: Type.STRING },
          background_complexity: { type: Type.STRING },
          single_person: { type: Type.BOOLEAN },
          is_minor_detected: { type: Type.BOOLEAN },
          has_heavy_filter: { type: Type.BOOLEAN },
          estimated_photo_quality: { type: Type.NUMBER }
        },
        required: ["usable_for_tryon", "full_body_visible"]
      }
    }
  });

  return JSON.parse(response.text?.trim() || "{}");
}

export async function checkOutfitCompatibility(garmentImages: { base64: string, mimeType: string }[]) {
  const ai = getAI();
  const imageParts = garmentImages.map((img) => ({
    inlineData: { data: img.base64.split(",")[1] || img.base64, mimeType: img.mimeType },
  }));

  const prompt = `I am building an outfit with these ${garmentImages.length} garment pieces. Assess whether they work together and return this exact JSON:
{
  "compatible": true,
  "compatibility_score": 0.82,
  "verdict": "Great combo | Works with styling | Clashes",
  "verdict_reason": "one sentence explaining why",
  "styling_tip": "one actionable tip to make the combo work better, or null if already great",
  "clash_type": null
}
clash_type (if applicable): "color_clash" | "formality_mismatch" | "pattern_overload" | "proportion_issue" | null`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...imageParts,
      prompt
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          compatible: { type: Type.BOOLEAN },
          compatibility_score: { type: Type.NUMBER },
          verdict: { type: Type.STRING },
          verdict_reason: { type: Type.STRING },
          styling_tip: { type: Type.STRING, nullable: true },
          clash_type: { type: Type.STRING, nullable: true }
        },
        required: ["compatible", "verdict"]
      }
    }
  });
  return JSON.parse(response.text?.trim() || "{}");
}

export async function generateStyleCaption(tryonResultBase64: string, garmentImagesBase64: string[], mimeType: string = "image/jpeg"): Promise<string> {
  const ai = getAI();
  
  try {
    const contents: any[] = [
      { inlineData: { data: tryonResultBase64.split(",")[1] || tryonResultBase64, mimeType } }
    ];

    for (const g of garmentImagesBase64) {
      contents.push({ inlineData: { data: g.split(",")[1] || g, mimeType } });
    }

    contents.push("Analyze the uploaded garments and the final outfit worn by the person in the image. Give a short, 2-3 sentence style suggestion on what additional things can be added along with this dress to make it an absolutely killer or dapper outfit (e.g., what specific color shoes, what kind of watch, or other accessories to add). Be creative but realistic. Do not include markdown or formatting.");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents
    });
    return response.text || "This looks great on you! Pair it with some clean shoes to complete the look.";
  } catch (error) {
    console.error("Caption generation failed:", error);
    return "This looks great on you! Pair it with some matching shoes to complete the look.";
  }
}

// Hackathon Demo Mode: Using specific provided image as placeholder result
export async function generateMockTryOn(personImageBase64: string, garmentImagesBase64: string[]): Promise<string> {
  // We fake the image generation by returning the specific presentation image provided by the user.
  // This allows for a flawless live demo without API limitations or rendering errors.
  return new Promise(async (resolve) => {
    try {
      const response = await fetch('/placeholder-result.png');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        // Add a short delay to simulate AI processing time before returning
        setTimeout(() => {
          resolve(reader.result as string);
        }, 2500); 
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      // Fallback if fetch fails
      setTimeout(() => {
        resolve(personImageBase64);
      }, 2500);
    }
  });
}
