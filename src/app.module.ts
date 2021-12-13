import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './modules/cards/cards.module';
import { StoresModule } from './modules/stores/stores.module';

@Module({
  imports: [CardsModule, StoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
