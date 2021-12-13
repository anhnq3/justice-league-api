import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from 'src/config/db.config';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  stores = db.collection('stores');

  async getAllStores() {
    const storeDetail = await this.stores.get();
    if (!storeDetail)
      throw new HttpException('Cannot get store', HttpStatus.BAD_REQUEST);
    const storeDoc = storeDetail.docs;
    const stores = storeDoc.map((stores) => ({
      id: stores.id,
      ...stores.data(),
    }));
    return stores;
  }

  async createStore(createStoreDto: CreateStoreDto) {
    await this.stores.add({
      ...createStoreDto,
      defaultQuantity: createStoreDto.itemQuantity,
    });
    return {
      message: 'create success',
      data: createStoreDto,
    };
  }

  async getStoreById(id: string) {
    const store = this.stores.doc(id);
    const exists = store.get();
    if (!exists)
      throw new HttpException('Store id is not found', HttpStatus.BAD_REQUEST);
    return store;
  }

  async updateStoreById(id: string, updateStoreDto: UpdateStoreDto) {
    const store = this.stores.doc(id);
    const exists = store.get();
    if (!exists)
      throw new HttpException('Store id is not found', HttpStatus.BAD_REQUEST);
    await store.update({ ...updateStoreDto });
    return { message: 'store update success', data: updateStoreDto };
  }

  async deleteStoreByID(id: string) {
    const store = this.stores.doc(id);
    const exists = store.get();
    if (!exists)
      throw new HttpException('Store id is not found', HttpStatus.BAD_REQUEST);
    await store.delete();
    return {
      message: 'delete success',
      id,
    };
  }
}
