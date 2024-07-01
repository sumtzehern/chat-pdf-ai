import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";

/**
 * Downloads a file from AWS S3 using the provided file key.
 *
 * @param {string} file_key - The key of the file in S3.
 * @return {Promise<string | null>} The path of the downloaded file, or null if an error occurred.
 */
export async function downloadFromS3(file_key: string) {

  try {
    const s3 = new S3({
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
    };
    const obj = await s3.getObject(params);
    const file_name = `./downloaded-pdf-${Date.now()}.pdf`;
    if (obj.Body instanceof require("stream").Readable) {
      // AWS-SDK v3 has some issues with their typescript definitions, but this works
      // https://github.com/aws/aws-sdk-js-v3/issues/843
      // @ts-ignore
      obj.Body?.pipe(fs.createWriteStream(file_name));
    }

    return file_name;

  } catch (error) {
    console.log(error);
    return null;
  }
}
