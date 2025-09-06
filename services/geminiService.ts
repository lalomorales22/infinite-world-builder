import { GoogleGenAI } from "@google/genai";
import type { GridData, Selection } from '../types';

// --- DEVELOPER TOGGLE ---
// Set this to true to use placeholder images and avoid using your API quota.
// Set this to false to generate real images with the Gemini API.
const MOCK_API = true;


if (!process.env.API_KEY && !MOCK_API) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getMockImageUrl = (text: string, width: number, height: number): string => {
    const cleanText = encodeURIComponent(text.substring(0, 100)); // Limit text length for URL
    return `https://placehold.co/${width}x${height}/C0C0C0/000000?text=${cleanText}`;
}

export const generateBaseTerrain = async (globalPrompt: string): Promise<string> => {
    if (MOCK_API) {
        console.log("Mocking base terrain generation...");
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        return getMockImageUrl(`Base Terrain: ${globalPrompt}`, 500, 500);
    }

    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
    }

    const fullPrompt = `
      **System Mandate:**
      - Generate a single, seamless, tileable image texture from a top-down, slightly isometric perspective, suitable for a strategic world map.
      - The texture should represent the base ground layer for the world.
      - Do not include any distinct features like buildings, roads, or units. Focus on the terrain itself (e.g., grass, sand, rock, water patterns).
      - The art style must be cohesive with the Global Theme.
      - Do not include any text, labels, or UI elements in the image.

      **Global Theme for the texture:**
      ${globalPrompt}
    `;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1', // Perfect for a square tile
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("AI did not return a base terrain image.");
        }
    } catch (error) {
        console.error("Error generating base terrain:", error);
        throw new Error("Failed to call the Gemini API. You may have exceeded your daily quota.");
    }
};

const getBoundaryContext = (selection: Selection, gridData: GridData): string => {
    const context: string[] = [];
    const startX = Math.min(selection.start.x, selection.end.x);
    const endX = Math.max(selection.start.x, selection.end.x);
    const startY = Math.min(selection.start.y, selection.end.y);
    const endY = Math.max(selection.start.y, selection.end.y);

    // North
    for (let x = startX; x <= endX; x++) {
        const cell = gridData.get(`${x},${startY - 1}`);
        if (cell && cell.prompt) {
            context.push(`The area to the north contains: ${cell.prompt}.`);
            break;
        }
    }
    // South
    for (let x = startX; x <= endX; x++) {
        const cell = gridData.get(`${x},${endY + 1}`);
        if (cell && cell.prompt) {
            context.push(`The area to the south contains: ${cell.prompt}.`);
            break;
        }
    }
    // West
    for (let y = startY; y <= endY; y++) {
        const cell = gridData.get(`${startX - 1},${y}`);
        if (cell && cell.prompt) {
            context.push(`The area to the west contains: ${cell.prompt}.`);
            break;
        }
    }
    // East
    for (let y = startY; y <= endY; y++) {
        const cell = gridData.get(`${endX + 1},${y}`);
        if (cell && cell.prompt) {
            context.push(`The area to the east contains: ${cell.prompt}.`);
            break;
        }
    }

    return context.length > 0 ? `Context of adjacent areas: ${context.join(' ')}` : "This is an isolated area.";
};

export const generateWorldTile = async (
    globalPrompt: string,
    localPrompt: string,
    selection: Selection,
    gridData: GridData,
): Promise<string> => {
    if (MOCK_API) {
        console.log("Mocking world tile generation...");
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const width = (Math.abs(selection.start.x - selection.end.x) + 1) * 50;
        const height = (Math.abs(selection.start.y - selection.end.y) + 1) * 50;
        return getMockImageUrl(localPrompt, width, height);
    }
    
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
    }
    
    const boundaryContext = getBoundaryContext(selection, gridData);

    const fullPrompt = `
      **System Mandate:**
      - Generate an image from a top-down, slightly isometric perspective, suitable for a strategic world map.
      - The art style must be cohesive with the Global Theme, but the content of the image must be *only* what is described in the "User's Request". Do not re-generate the base terrain described in the Global Theme.
      - The generated image must seamlessly tile with its neighbors based on the provided context.
      - Do not include any text, labels, or UI elements in the image.
      - The output must be a single, cohesive image for the entire requested area.

      **Global Theme (for art style reference only):**
      ${globalPrompt}

      **Boundary Context:**
      ${boundaryContext}

      **User's Request for the selected area (generate only this):**
      ${localPrompt}
    `;
    
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: fullPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("AI did not return an image.");
        }
    } catch (error) {
        console.error("Error generating world tile:", error);
        throw new Error("Failed to call the Gemini API. You may have exceeded your daily quota.");
    }
};