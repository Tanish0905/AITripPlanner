import {GoogleGenerativeAI} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat( {
    generationConfig,
    history: [
        {
            role: 'user',
            parts: [
                {text:"Generate Travel Plan for Location : LAs Vegas, for 3 Days for Couple with a Cheap budget ,Give me Hotels options list with HotelName, Hotel address, Price image url,geo coordinates, rating, description and suggest itinerary with placename,Place Details ,Place Image Url ,Geo Coordinates, ticket Pricing, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format."}
            ]
        }
    ]
  })

  const result = await chatSession.sendMessage( "INSERT_INPUT_HERE" );
  console.log( result.response.text() );
