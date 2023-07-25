import { Module } from '@nestjs/common';
import { ChatModule } from './modules/chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config/config.schema';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({
      envFilePath: [`src/config/.env.${process.env.NODE_ENV}`],
      validationSchema: configValidationSchema,
    }),
  ],
  controllers: [],
})
export class AppModule {
}
