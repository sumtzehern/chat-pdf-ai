import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(file: File) {
    try {
        const s3 = new S3({
            region: process.env.NEXT_PUBLIC_AWS_REGION,
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
            },
        })

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(" ", "-")

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: file_key,
            Body: file
        };

        s3.putObject(
            params,
            (err: any, data: PutObjectCommandOutput | undefined) => {
              return Promise.resolve({
                file_key,
                file_name: file.name,
              });
            }
          );
         
    } catch(error) {
        console.log(error)
    }
}

/**
 * Generates the URL for a file in AWS S3 based on the provided file key.
 *
 * @param {string} file_key - The key of the file in S3.
 * @return {string} The URL for the file in S3.
 */
export function getS3Url(file_key: string) {
    const url =  `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file_key}`
    return url
}