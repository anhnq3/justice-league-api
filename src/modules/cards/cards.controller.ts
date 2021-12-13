import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}
  @Get()
  getAll() {
    return this.cardsService.getAllCard();
  }

  @Get('test/:item')
  testing(@Param('item') item: string) {
    // return item;
    return this.cardsService.testing(item);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.createCards(createCardDto);
  }

  // @UsePipes(new ValidationPipe({ transform: true }))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  updateCardById(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    // return { id, updateCardDto };
    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  deleteCard(@Param('id') id: string) {
    return this.cardsService.deleteCard(id);
  }

  @Get('deleteitem/:id')
  deleteItem(@Param('id') id: string) {
    return this.cardsService.deleteItem(id);
  }

  @Get(':id')
  getCardById(@Param('id') id: string) {
    return this.cardsService.getCardById(id);
  }
}
