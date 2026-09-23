import { GoogleGenAI } from '@google/genai';
import firebaseConfig from '../../firebase-applet-config.json';

// Verifies the caller holds a valid, non-expired Firebase Auth ID token for
// this project, using Firebase's public Identity Toolkit REST endpoint.
// This keeps the AI image-generation quota from being burned by anonymous
// callers who discover this endpoint URL.
async function verifyFirebaseIdToken(idToken: string): Promise<boolean> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!res.ok) return false;
  const data = await res.json();
  return Array.isArray(data.users) && data.users.length === 1;
}

export const handler = async (event: { httpMethod: string; headers: Record<string, string | undefined>; body: string | null }) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  const idToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!idToken || !(await verifyFirebaseIdToken(idToken))) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized.' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server is not configured with a Gemini API key.' }) };
  }

  let title: string | undefined;
  let excerpt: string | undefined;
  try {
    const parsed = JSON.parse(event.body || '{}');
    title = parsed.title;
    excerpt = parsed.excerpt;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  if (!title || typeof title !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'A title is required.' }) };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Create a high-quality blog post banner image for a professional construction and logistics firm.
Title: "${title}"
${excerpt ? `Context: ${excerpt}` : ''}
Style: Professional, clean, modern, architectural photography style. Use a professional blue and orange color palette matching the brand identity.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: '16:9' } },
    });

    let imageUrl: string | null = null;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No image was generated in the response.' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ imageUrl }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || 'Image generation failed.' }) };
  }
};
