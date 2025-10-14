import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: `${path}/uploads`,
      // rootPath: '/app/uploads',
      // serveRoot: '/', // отдаём из корня
      // exclude: ['/api*', '/graphql*'], // важно, чтобы не перехватывать API
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
