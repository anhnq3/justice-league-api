import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from 'src/config/db.config';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  stores = db.collection('stores');
  cards = db.collection('cards');

  async getAllStores() {
    const storeDetail = await this.stores.get();
    if (!storeDetail)
      throw new HttpException('Cannot get store', HttpStatus.BAD_REQUEST);
    const storeDoc = storeDetail.docs;
    const stores = storeDoc.map((stores: any) => ({
      id: stores.id,
      itemName: stores.data().itemName,
      itemQuantity: stores.data().itemQuantity,
      defaultQuantity: stores.data().defaultQuantity,
      attack: stores.data().attack,
      defence: stores.data().defence,
      lucky: stores.data().lucky,
      agile: stores.data().agile,
      // ...stores.data(),
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
    const exists = await store.get();
    if (!exists.createTime)
      throw new HttpException('Store id is not found', HttpStatus.BAD_REQUEST);
    return exists.data();
  }

  async updateStoreById(id: string, updateStoreDto: UpdateStoreDto) {
    const { attack, defence, agile, lucky } = updateStoreDto;
    const store = this.stores.doc(id);
    const exists = await store.get();
    if (!exists.createTime)
      throw new HttpException('Store id is not found', HttpStatus.BAD_REQUEST);

    const updateProperty = [];

    // UpdateProperty
    // if 0 mean not update
    // else are being update
    if (attack) updateProperty.push(attack);
    else updateProperty.push(0);
    if (defence) updateProperty.push(defence);
    else updateProperty.push(0);
    if (agile) updateProperty.push(agile);
    else updateProperty.push(0);
    if (lucky) updateProperty.push(lucky);
    else updateProperty.push(0);

    // Find card exists this service
    // const cardFind: any = this.cards.where('name', '==', 'batman');
    const cardFind: any = this.cards.where('items', 'array-contains-any', [id]);
    const card = await cardFind.get();

    return card.docs.map((data) => {
      // If insert property
      // Get exists card properties
      const attackExistsCardProperty = data.data().attack;
      const defenceExistsCardProperty = data.data().defence;
      const agileExistsCardProperty = data.data().agile;
      const luckyExistsCardProperty = data.data().lucky;

      // Get exists item properties
      const attackExistsItemProperty = exists.data().attack;
      const defenceExistsItemProperty = exists.data().defence;
      const agileExistsItemProperty = exists.data().agile;
      const luckyExistsItemProperty = exists.data().lucky;

      // Get default card properties
      const attackDefaultProperty =
        attackExistsCardProperty - attackExistsItemProperty;
      const defenceDefaultProperty =
        defenceExistsCardProperty - defenceExistsItemProperty;
      const agileDefaultProperty =
        agileExistsCardProperty - agileExistsItemProperty;
      const luckyDefaultProperty =
        luckyExistsCardProperty - luckyExistsItemProperty;

      // Update exists card property that have update item (updatedto + default property)
      const attackAfterUpdate = attack + attackDefaultProperty;
      const defenceAfterUpdate = defence + defenceDefaultProperty;
      const agileAfterUpdate = agile + agileDefaultProperty;
      const luckyAfterUpdate = lucky + luckyDefaultProperty;

      return {
        attackAfterUpdate: attackAfterUpdate,
        defenceAfterUpdate: defenceAfterUpdate,
        agileAfterUpdate: agileAfterUpdate,
        luckyAfterUpdate: luckyAfterUpdate,
      };
      // Update cards
    });
    // return card.docs.map((data) => data.data());

    await store.update({ ...updateStoreDto });
    return { message: 'store update success', data: updateStoreDto };
  }

  async deleteStoreByID(id: string) {
    const store = this.stores.doc(id);
    const exists = await store.get();
    if (!exists.createTime)
      throw new HttpException('Store id is not found', HttpStatus.BAD_REQUEST);
    await store.delete();
    return {
      message: 'delete success',
      id,
    };
  }
  // Function
  isDouble(number: number) {
    if (number % 1 != 0)
      throw new HttpException(
        `Data: ${number} is a double type not a integer`,
        HttpStatus.BAD_REQUEST,
      );
  }

  notLowerThanZero(number: number) {
    if (number < 0)
      throw new HttpException(
        `Data is lower than 0 !!!`,
        HttpStatus.BAD_REQUEST,
      );
  }
}
