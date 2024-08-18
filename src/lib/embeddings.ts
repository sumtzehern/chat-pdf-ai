import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

/**
 * Retrieves a vector of dimensions representing the embeddings of a given text using the OpenAI API.
 *
 * @param {string} text - The input text to generate embeddings for.
 * @return {number[]} A vector of dimensions representing the embeddings of the input text.
 */
export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-3-small",
      input: text.replace(/\n/g, " "),
    });

    const result = await response.json();
    console.log('OpenAI API response:', result);

    if (result.error) {
      console.error("OpenAI API error:", result.error);
      throw new Error(`OpenAI API error: ${result.error.message}`);
    }

    return result.data[0].embedding as number[]; //Vector of dimensions
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}