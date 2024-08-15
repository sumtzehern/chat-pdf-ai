import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

/**
 * Retrieves matches from a Pinecone index based on the provided embeddings and file key.
 *
 * @param {number[]} embeddings - The vector embeddings to query the index with.
 * @param {string} fileKey - The file key used to determine the namespace in the index.
 * @return {object[]} An array of matches from the query result, or an empty array if no matches are found.
 */
export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const indexes = await client.listIndexes();
    console.log("Available indexes:", indexes);

    const pineconeIndex = await client.index(process.env.PINECONE_INDEX_NAME!);
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
    throw error;
  }
}

/**
 * Retrieves relevant context from a query and file key.
 *
 * @param {string} query - The query string used to retrieve context.
 * @param {string} fileKey - The file key used to determine the namespace in the index.
 * @return {string} The retrieved context, limited to 3000 characters.
 */
export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  console.log("Query Embeddings:", queryEmbeddings);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  console.log("Pinecone Matches:", matches);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.1 // Use a threshold to filter relevant results
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => formatText((match.metadata as Metadata).text));
  const context = docs.join("\n").substring(0, 3000);
  // 5 vectors
  console.log("Final Context Sent to GPT:", context);
  return context;
}

function formatText(text: string): string {
  // Replace sequences of multiple spaces with a single space
  text = text.replace(/\s+/g, ' ');
  
  // Insert spaces between words and special characters (like in URLs, emails, etc.)
  text = text.replace(/([a-zA-Z0-9])([!@#$%^&*(),.?":{}|<>])/g, '$1 $2');
  text = text.replace(/([!@#$%^&*(),.?":{}|<>])([a-zA-Z0-9])/g, '$1 $2');
  
  // Add newlines for better readability after periods, question marks, or exclamations
  text = text.replace(/(\.|\?|!)([a-zA-Z])/g, '$1\n$2');
  
  // Add newlines before and after each bullet point
  text = text.replace(/●/g, '\n● ');
  
  return text.trim();
}