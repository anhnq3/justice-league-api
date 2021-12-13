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
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}
  @Get()
  getAllStores() {
    return this.storesService.getAllStores();
  }

  @Get(':id')
  getStoreById(@Param('id') id: string) {
    return this.storesService.getStoreById(id);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.createStore(createStoreDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Put(':id')
  updateStoreById(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    // updateStoreById(@Param('id') id: string, updateStoreDto: UpdateStoreDto) {
    return this.storesService.updateStoreById(id, updateStoreDto);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.storesService.deleteStoreByID(id);
  }
}
