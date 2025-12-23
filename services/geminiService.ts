
import { GoogleGenAI, Type } from "@google/genai";
import { TranslationFeedback, WritingFeedback } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TRANSLATION_SYSTEM_INSTRUCTION = `You are an elite IELTS translation coach and examiner. 
Your goal is to evaluate a Chinese-to-English translation from an exam perspective.
You must provide exactly three versions of English translation: Standard, Natural, and Advanced IELTS (Band 7.5+).
Label mistakes as [Grammar], [Vocabulary], [Collocation], [Logic], or [Style].
Give a realistic IELTS writing band (0-9). 
Be direct, instructional, and concise. No encouragement cliches.`;

const WRITING_SYSTEM_INSTRUCTION = `You are a professional IELTS Writing Examiner. 
Analyze essays based on Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.
Provide a total band score and breakdown.
Identify strong and weak sentences. 
Suggest vocabulary and structure upgrades.
Rewrite only selected key paragraphs for improvement.
Tone: Honest, exam-focused, direct.`;

export const getTranslationFeedback = async (chineseSentence: string, userTranslation: string): Promise<TranslationFeedback> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Chinese: ${chineseSentence}\nUser Translation: ${userTranslation}`,
    config: {
      systemInstruction: TRANSLATION_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          translations: {
            type: Type.OBJECT,
            properties: {
              standard: { type: Type.STRING },
              natural: { type: Type.STRING },
              advanced: { type: Type.STRING }
            },
            required: ["standard", "natural", "advanced"]
          },
          critique: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["Grammar", "Vocabulary", "Collocation", "Logic", "Style"] },
                issue: { type: Type.STRING },
                suggestion: { type: Type.STRING }
              }
            }
          },
          estimatedBand: { type: Type.NUMBER }
        },
        required: ["translations", "critique", "estimatedBand"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getWritingFeedback = async (task: string, essay: string): Promise<WritingFeedback> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Task/Prompt: ${task}\nUser Essay: ${essay}`,
    config: {
      systemInstruction: WRITING_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallBand: { type: Type.NUMBER },
          criteria: {
            type: Type.OBJECT,
            properties: {
              taskResponse: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } } },
              coherence: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } } },
              lexical: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } } },
              grammar: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, justification: { type: Type.STRING } } }
            }
          },
          sentenceLevel: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["strong", "weak"] },
                explanation: { type: Type.STRING },
                improved: { type: Type.STRING }
              }
            }
          },
          upgrades: {
            type: Type.OBJECT,
            properties: {
              vocabulary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { old: { type: Type.STRING }, improved: { type: Type.STRING }, context: { type: Type.STRING } }
                }
              },
              structures: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { original: { type: Type.STRING }, improved: { type: Type.STRING } }
                }
              }
            }
          },
          revisedParagraphs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { original: { type: Type.STRING }, revised: { type: Type.STRING } }
            }
          }
        },
        required: ["overallBand", "criteria", "sentenceLevel", "upgrades", "revisedParagraphs"]
      }
    }
  });

  return JSON.parse(response.text);
};
