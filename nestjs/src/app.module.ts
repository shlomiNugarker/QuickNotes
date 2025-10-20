import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { User } from './entities/user.entity';
import { Note } from './entities/note.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'postgres'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'quicknotes'),
        entities: [User, Note],
        synchronize: true, // Don't use in production!
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    AuthModule,
    NotesModule,
    HealthModule,
  ],
})
export class AppModule {}
