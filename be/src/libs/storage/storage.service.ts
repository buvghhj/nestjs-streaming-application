import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, type DeleteObjectCommandInput, ObjectCannedACL, PutObjectCommand, type PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {

    private readonly client: S3Client

    private readonly bucket: string

    public constructor(private readonly configService: ConfigService) {

        this.client = new S3Client({

            region: this.configService.getOrThrow<string>('S3_AWS_REGION'),

            credentials: {

                accessKeyId: this.configService.getOrThrow<string>('S3_AWS_ACCESS_KEY_ID'),

                secretAccessKey: this.configService.getOrThrow<string>('S3_AWS_SECRET_ACCESS_KEY')

            }

        })

        this.bucket = this.configService.getOrThrow<string>('S3_AWS_BUCKET_NAME')

    }

    public async upload(buffer: Buffer, key: string, mimetype: string, acl: ObjectCannedACL = ObjectCannedACL.private) {

        const command: PutObjectCommandInput = {

            Bucket: this.bucket,

            Key: String(key),

            Body: buffer,

            ContentType: mimetype,

            ACL: acl,

            CacheControl: "no-cache, no-store, must-revalidate"

        }

        try {

            await this.client.send(new PutObjectCommand(command))

        } catch (error) {

            console.error('S3 upload failed:', error)

            throw new Error(`Failed to upload file: ${error.message}`)

        }

    }

    public async remove(key: string) {

        const command: DeleteObjectCommandInput = {

            Bucket: this.bucket,
            Key: String(key),

        }

        try {

            await this.client.send(new DeleteObjectCommand(command))

        } catch (error) {

            console.error('S3 upload failed:', error)

            throw new Error(`Failed to upload file: ${error.message}`)

        }

    }

}
