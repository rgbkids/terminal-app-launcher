import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, '../ssl/private.key')),
    cert: fs.readFileSync(path.join(__dirname, '../ssl/term-app.crt')),
    ca: fs.readFileSync(path.join(__dirname, '../ssl/term-app.ca-bundle')),
};

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        httpsOptions: sslOptions,
    });
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 443;
    await app.listen(port);
    console.log(`Server running on port ${port}`);
}
bootstrap();