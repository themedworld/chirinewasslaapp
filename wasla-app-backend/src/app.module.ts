import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import{TypeOrmModule} from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions),
     ConfigModule.forRoot({
      isGlobal: true, // permet d'utiliser process.env partout
    }),
    UsersModule,
   RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
