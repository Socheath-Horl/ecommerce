import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly endpoint: string;
  private readonly port: number;
  private readonly useSsl: boolean;
  private readonly bucket: string;
  private readonly client: Minio.Client;

  constructor(config: ConfigService) {
    this.endpoint = config.get<string>('MINIO_ENDPOINT') ?? 'localhost';
    this.port = Number(config.get<string>('MINIO_PORT') ?? 9000);
    this.useSsl = (config.get<string>('MINIO_USE_SSL') ?? 'false') === 'true';
    this.bucket = config.get<string>('MINIO_BUCKET') ?? 'ecommerce';
    this.client = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSsl,
      accessKey: config.get<string>('MINIO_ACCESS_KEY') ?? 'minioadmin',
      secretKey: config.get<string>('MINIO_SECRET_KEY') ?? 'minioadmin',
    });
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) await this.client.makeBucket(this.bucket);
    await this.client.setBucketPolicy(this.bucket, JSON.stringify(this.publicReadPolicy()));
    this.logger.log(`MinIO bucket '${this.bucket}' ready`);
  }

  async upload(key: string, buffer: Buffer, contentType: string): Promise<void> {
    await this.client.putObject(this.bucket, key, buffer, buffer.length, {
      'Content-Type': contentType,
    });
  }

  async remove(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }

  getUrl(key: string): string {
    return `${this.useSsl ? 'https' : 'http'}://${this.endpoint}:${this.port}/${this.bucket}/${key}`;
  }

  get bucketName(): string {
    return this.bucket;
  }

  private publicReadPolicy() {
    return {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    };
  }
}