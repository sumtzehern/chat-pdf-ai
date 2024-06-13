import AWS from 'aws-sdk';

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            },
            region: process.env.NEXT_PUBLIC_AWS_REGION
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(" ", "-")

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: file_key,
            Body: file
        };

        const upload = s3.putObject(params).on('httpUploadProgress', (progress) => {
            console.log('Uploading ...', parseInt(((progress.loaded * 100) / progress.total).toString()) + "%"); //uploading percentage
        }).promise();

        await upload.then(data => {
            console.log("Successfully uploaded file to S3", file_key);
        })

        return Promise.resolve({
            file_key,
            file_name: file.name
        })
         
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