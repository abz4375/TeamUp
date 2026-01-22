import * as Minio from "minio";

if (!process.env.MINIO_ENDPOINT) {
    throw new Error("MINIO_ENDPOINT is not defined");
}

export const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || "team-up-attachments";

export async function ensureBucket() {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
        // Set public read policy for attachments if needed, or use presigned URLs
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
                },
            ],
        };
        await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    }
}

export async function getPresignedPostUrl(filename: string, contentType: string) {
    const objectName = `${Date.now()}-${filename}`;

    // We can use presignedUrl for putObject or presignedPostPolicy
    const url = await minioClient.presignedPutObject(BUCKET_NAME, objectName, 24 * 60 * 60);

    return {
        url,
        objectName,
    };
}

export function getFileUrl(objectName: string) {
    const protocol = process.env.MINIO_USE_SSL === "true" ? "https" : "http";
    const host = process.env.MINIO_PUBLIC_URL || `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;
    return `${protocol}://${host}/${BUCKET_NAME}/${objectName}`;
}
