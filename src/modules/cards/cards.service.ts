import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from 'src/config/db.config';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  cards = db.collection('cards');
  stores = db.collection('stores');

  async testing() {
    // const card = this.cards.doc(id);
    // const exists = await card.get();
    // const update = await card.update({ ...updateCardDto });
    // return (await this.cards.where('name', '==', 'batman').get()).docs[0];
  }

  async getAllCard(): Promise<any> {
    const cardDetail = await this.cards.get();
    if (!cardDetail)
      throw new HttpException('Cannot get card', HttpStatus.BAD_REQUEST);
    const cardDoc = cardDetail.docs;
    const cards: any[] = cardDoc.map((cards) => ({
      id: cards.id,
      ...cards.data(), // Get data from this?
    }));
    // Get data then interface need to call like on line 21
    // console.log(cards[0].name);
    return cards;
  }

  async createCards(createCardDto: CreateCardDto) {
    const create = await this.cards.add({ ...createCardDto });
    if (!create)
      throw new HttpException('Card hasn`t create', HttpStatus.BAD_REQUEST);
    if (createCardDto.items) {
      const item = this.stores.doc(createCardDto.items).get();
      if (!(await item).createTime)
        throw new HttpException('Item is not found', HttpStatus.BAD_REQUEST);
    }
    return { message: 'card create success', data: createCardDto };
  }

  async getCardById(id: string) {
    const card = await this.cards.doc(id).get();
    if (!card.createTime)
      throw new HttpException('Card id is not found', HttpStatus.BAD_REQUEST);
    return card.data();
  }

  //This error
  async updateCard(id: string, updateCardDto: UpdateCardDto) {
    const card = this.cards.doc(id);
    const exists = await card.get();
    if (!exists.createTime)
      throw new HttpException('Card id is not found', HttpStatus.BAD_REQUEST);

    // Item update logic
    if (updateCardDto.items) {
      // const finditem = this.findItem(updateCardDto.items);
      // const getStoreIdFromCard = await this.getStoreIdFromCard(id);
      // const minusItem = this.minusItem(updateCardDto.items);
      // const returnItem = this.returnItem(await this.getStoreIdFromCard(id));
      // Promise.all([finditem, getStoreIdFromCard, minusItem, returnItem]).then(
      //   (data: any) => {
      //     console.log('array 0: \n', data[0]);
      //     console.log('array 1: \n', data[1]);
      //     console.log('array 2: \n', data[2]);
      //     console.log('array 3: \n', data[3]);
      //   },
      // );

      // Check if store id exists
      await this.findItem(updateCardDto.items);
      // If items in dto different with item in database
      const getStoreIdFromCard = await this.getStoreIdFromCard(id);
      if (getStoreIdFromCard != updateCardDto.items) {
        // If Items exists
        if (getStoreIdFromCard) {
          // Then plus again in store
          await this.returnItem(getStoreIdFromCard);
        }
        // Then minus one quantity in store
        await this.minusItem(updateCardDto.items);
      }
    }

    const update = await card.update({ ...updateCardDto });
    if (!update)
      throw new HttpException('Card hasn`t update', HttpStatus.BAD_REQUEST);
    return { message: 'card update success', data: updateCardDto };
  }

  async deleteCard(id: string) {
    const card = this.cards.doc(id);
    const exists = await card.get();
    if (!exists.createTime)
      throw new HttpException('Card id is not found', HttpStatus.BAD_REQUEST);

    await card.delete();
    return {
      message: 'delete success',
      id,
    };
  }

  async deleteItem(id: string) {
    this.cards.doc(id).update({ item: '' });
    return {
      message: 'Delete item complete',
    };
  }

  // Function
  // Find item and check if it exists
  async findItem(item: string) {
    const itemExists = this.stores.doc(item);
    if (!(await itemExists.get()).createTime) {
      throw new HttpException('Item not exists', HttpStatus.BAD_REQUEST);
    }
    return itemExists;
  }

  async getStoreIdFromCard(cardId: string) {
    const storeId: any = (await this.cards.doc(cardId).get()).data();
    return storeId.items;
  }

  async getStoreItemQuantity(item: string) {
    const getItemQuantity: any = (
      await (await this.findItem(item)).get()
    ).data();
    return getItemQuantity.itemQuantity;
  }

  async minusItem(item: string) {
    const itemQuantityMinus = (await this.getStoreItemQuantity(item)) - 1;
    const itemFind = this.stores.doc(item);
    await itemFind.update({ itemQuantity: itemQuantityMinus });
    console.log('Quantity in store - 1');
  }

  async returnItem(item: string) {
    const itemQuantityPlus = (await this.getStoreItemQuantity(item)) + 1;
    const itemFind = this.stores.doc(item);
    itemFind.update({ itemQuantity: itemQuantityPlus });
    console.log('Quantity in store before + 1');
  }
}
