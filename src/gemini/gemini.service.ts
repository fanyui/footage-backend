import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI, FunctionDeclarationSchemaType, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },

];
const responseSchema = {
    type: FunctionDeclarationSchemaType.ARRAY,
    description: "detect any crime related event or suspect in the video.",
    items: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
            id: {
                type: FunctionDeclarationSchemaType.STRING,
                description: "A Unique UUID Identifier identifying this particular event eg 1234-5678-9101",
            },
            severity: {
                type: FunctionDeclarationSchemaType.NUMBER,
                description: "The severity of the event happening, eg 1-10 with 10 being the most severe",
            },
            confidence: {
                type: FunctionDeclarationSchemaType.NUMBER,
                description: "The degree of confidence of the suspected event happening, eg 1-10 with 10 being the most confident",
            },
            eventType: {
                type: FunctionDeclarationSchemaType.STRING,
                description: "The type of suspected event happending, eg robbery,etc.",
            },
            eventStartTime: {
                type: FunctionDeclarationSchemaType.STRING,
                description: "Time when the suspected event happens in the video",
            },
            eventEndTime: {
                type: FunctionDeclarationSchemaType.STRING,
                description: "Time when the suspected event ends in the video",
            },
            description: {
                type: FunctionDeclarationSchemaType.STRING,
                description: "Bried Description of the event happening",
            },
            suspect: {
                type: FunctionDeclarationSchemaType.ARRAY,
                description: "list of individual suspects that are involved in the detected malicious event",
                items: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        confidence: {
                            type: FunctionDeclarationSchemaType.NUMBER,
                            description: "The degree of confidence of the suspected, eg 1-10 with 10 being the most confident",
                        },
                        appearance: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: "The description of the suspect how they appear in the video",
                        },
                        firstCited: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: "time stamp the suspect first appear in the video",
                        },

                        behavior: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: "The behavior of the suspect in the video",
                        },
                        associatedItems: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: "The items associated with the suspect",
                        },
                        description: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: "Description",
                        },

                    }
                },
            },

        },
        required: ["severity", "confidence", "eventStartTime", "eventEndTime", "description", "suspect"],

    }
}


@Injectable()
export class GeminiService {
    private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    private model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
    });

    private fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);


    constructor() {
    }
    getModel() {
        return this.model;
    }
    getGenAIForSecurity() {
        return this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash", systemInstruction: "You are an expert in extracting information from a video and analysis and crime detection.",
            safetySettings, generationConfig: { responseMimeType: "application/json", responseSchema: responseSchema }
        });
        // this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, tools:[add_to_database]);
    }
    getGenAI() {
        return this.genAI;
    }
    getFileManager() {
        return this.fileManager;
    }

    createFunction() {
        return this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" }, safetySettings, systemInstruction: "You are an expert in video analysis and crime detection. Format the response in a json that can be used by a thirdparty api",

        },
        );

    }
}
