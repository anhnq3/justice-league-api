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

  async updateCard(id: string, updateCardDto: UpdateCardDto) {
    const { items } = updateCardDto;

    const card = this.cards.doc(id);
    const exists = await card.get();
    if (!exists.createTime)
      throw new HttpException('Card id is not found', HttpStatus.BAD_REQUEST);

    // Declare property(default)
    let attackProperty = exists.data().attack;
    let defenceProperty = exists.data().defence;
    let agileProperty = exists.data().agile;
    let luckyProperty = exists.data().lucky;

    // get new item
    const item = this.stores.doc(items);
    const getNewItem: any = await item.get();

    // get new property item
    const attackNew = getNewItem.data().attack;
    const defenceNew = getNewItem.data().defence;
    const agileNew = getNewItem.data().agile;
    const luckyNew = getNewItem.data().lucky;

    // This is property if card hasnt have an item
    // property = property + new item property
    attackProperty += attackNew;
    defenceProperty += defenceNew;
    agileProperty += agileNew;
    luckyProperty += luckyNew;

    // Item update logic
    if (updateCardDto.items) {
      // If this card already have item
      if (exists.data().items) {
        // then that get old item
        const getOldItem: any = await this.stores
          .doc(exists.data().items)
          .get();
        // then that get old item data
        const getOldItemData = getOldItem.data();
        // get that item property
        const attackOldItemPropery = getOldItemData.attack;
        const defenceOldItemPropery = getOldItemData.defence;
        const agileOldItemPropery = getOldItemData.agile;
        const luckyOldItemPropery = getOldItemData.lucky;

        // property = property - old item property
        attackProperty = attackProperty - attackOldItemPropery;
        defenceProperty = defenceProperty - defenceOldItemPropery;
        agileProperty = agileProperty - agileOldItemPropery;
        luckyProperty = luckyProperty - luckyOldItemPropery;

        return {
          attackProperty,
          defenceProperty,
          agileProperty,
          luckyProperty,
        };
      }
      // card.update({
      //   ...updateCardDto,
      //   attack: attackProperty,
      //   defence: defenceProperty,
      //   agile: agileProperty,
      //   lucky: luckyProperty,
      // });

      return {
        message: 'Update complete',
        ...updateCardDto,
        attack: attackProperty,
        defence: defenceProperty,
        agile: agileProperty,
        lucky: luckyProperty,
      };
    }
  }

  // Missing adding 1 in quantity and update card property
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
    const card = this.cards.doc(id);
    const exists = await card.get();
    if (!exists.createTime)
      throw new HttpException('Card id is not found', HttpStatus.BAD_REQUEST);
    const storeData = (
      await (await this.findItem(exists.data().items)).get()
    ).data();
    const storeAttack = storeData.attack;
    const storeDefence = storeData.defence;
    const storeAgile = storeData.agile;
    const storeLucky = storeData.agile;
    // Clear item and update
    const defaultAttack = exists.data().attack - storeAttack;
    const defaultDefence = exists.data().defence - storeDefence;
    const defaultAgile = exists.data().agile - storeAgile;
    const defaultLucky = exists.data().lucky - storeLucky;

    card.update({
      items: '',
      attack: defaultAttack,
      defence: defaultDefence,
      agile: defaultAgile,
      lucky: defaultLucky,
    });

    return {
      message: 'Clear item complete',
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
}
