import "reflect-metadata";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const errorMessages = errors.map(error => {
        const constraints = error.constraints || {};
        const firstMessage = Object.values(constraints)[0] || 'Validation failed';
        
        return {
          field: error.property,
          message: firstMessage
        };
      });
      
      return new BadRequestException({
        success: false,
        message: 'Validation failed',
        errors: errorMessages
      });
    }
  }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Run seeder after app is ready
  const seederService = app.get(SeederService);
  await seederService.seedAll();
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
