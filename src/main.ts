import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  await app.listen(port,()=>{
    console.log(`server is started on ${port} : http://localhost:3000`)
  });
}
bootstrap();
