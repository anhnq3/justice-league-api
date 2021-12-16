import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from 'src/config/db.config';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  cards = db.collection('cards');
  stores = db.collection('stores');

  async getAllCard(): Promise<any> {
    const cardDetail = await this.cards.get();
    if (!cardDetail)
      throw new HttpException('Cannot get card', HttpStatus.BAD_REQUEST);
    const cardDoc = cardDetail.docs;
    const cards: any = cardDoc.map((cards: any) => ({
      id: cards.id,
      name: cards.data().name,
      realName: cards.data().realName,
      joinedIn: cards.data().joinedIn,
      sex: cards.data().sex,
      items: cards.data().items,
      image: cards.data().image,
      attack: cards.data().attack,
      defence: cards.data().defence,
      lucky: cards.data().lucky,
      angile: cards.data().angile,
    }));
    if (cards.length < 3)
      return { message: 'You need to have at lease 3 cards', data: cards };

    return cards;
  }

  async createCards(createCardDto: CreateCardDto) {
    if (createCardDto.items)
      throw new HttpException(
        'Items can`t be create must be in update',
        HttpStatus.BAD_REQUEST,
      );
    if ((await this.cards.get()).docs.length > 6)
      return { message: 'Card maximum number is 7' };
    const create = await this.cards.add({ ...createCardDto, items: [] });
    if (!create)
      throw new HttpException('Card hasn`t create', HttpStatus.BAD_REQUEST);
    return {
      message: 'card create success',
      data: { ...createCardDto, items: [] },
    };
  }

  async getCardById(id: string) {
    const card = await this.cards.doc(id).get();
    if (!card.createTime)
      throw new HttpException('Card id is not found', HttpStatus.BAD_REQUEST);
    return card.data();
  }

  async updateCard(id: string, updateCardDto: UpdateCardDto) {
    const { agile, attack, lucky, defence } = updateCardDto;

    if (lucky != undefined)
      throw new HttpException(
        'This property cannot be update',
        HttpStatus.BAD_REQUEST,
      );
    if (agile != undefined)
      throw new HttpException(
        'This property cannot be update',
        HttpStatus.BAD_REQUEST,
      );
    if (attack != undefined)
      throw new HttpException(
        'This property cannot be update',
        HttpStatus.BAD_REQUEST,
      );
    if (defence != undefined)
      throw new HttpException(
        'This property cannot be update',
        HttpStatus.BAD_REQUEST,
      );

    const card = this.cards.doc(id);
    const exists = await card.get();
    if (!exists.createTime)
      throw new HttpException('Card id is not found', HttpStatus.BAD_REQUEST);

    // Declare property(default)
    let attackProperty = exists.data().attack;
    let defenceProperty = exists.data().defence;
    let agileProperty = exists.data().agile;
    let luckyProperty = exists.data().lucky;

    // Item update logic
    if (updateCardDto.items) {
      const { items } = updateCardDto;

      const findItem = [];

      // Check item
      for (let i = 0; i < items.length; i++)
        findItem.push(await this.findItem(items[i]));

      // get new item
      for (let i = 0; i < items.length; i++) {
        // Find item
        const item = findItem[i];
        // const item = await this.findItem(items[i]);

        // Get item
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

        // If this card already have item
        if (exists.data().items[i]) {
          return {
            message: 'Please remove item before add again',
            itemsExists: exists.data().items,
          };
        }

        // Get new item quantity
        const newItemQuantity = getNewItem.data().itemQuantity;

        // -1 quantity in stores
        const quantityItemUpdate = newItemQuantity - 1;
        this.notLowerThanZero(quantityItemUpdate);

        // Update
        // Update item quantity
        item.update({ itemQuantity: quantityItemUpdate });

        // Update cards
        card.update({
          ...updateCardDto,
          attack: attackProperty,
          defence: defenceProperty,
          agile: agileProperty,
          lucky: luckyProperty,
        });
      }

      return {
        message: 'Update complete',
        data: {
          ...updateCardDto,
          attack: attackProperty,
          defence: defenceProperty,
          agile: agileProperty,
          lucky: luckyProperty,
        },
      };
    }

    // If dont have item then:
    card.update({ ...updateCardDto });
    return { message: 'Update complete', data: { ...updateCardDto } };
  }

  // Missing adding 1 in quantity and update card property
  async deleteCard(id: string) {
    const card = this.cards.doc(id);
    const exists = await card.get();
    if (!exists.createTime)
      throw new HttpException('Card id is not found', HttpStatus.BAD_REQUEST);

    if ((await this.cards.get()).docs.length < 4)
      return { message: 'Number of cards now is 3 cannot delete more' };

    card.delete();
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

    let attackItem: number,
      defenceItem: number,
      agileItem: number,
      luckyItem: number,
      attackCard: number,
      defenceCard: number,
      agileCard: number,
      luckyCard: number,
      item: any,
      getItem: any,
      itemData: any;

    //Get item id from card
    const itemId = exists.data().items;
    if (itemId) {
      // Get card property
      attackCard = exists.data().attack;
      defenceCard = exists.data().defence;
      agileCard = exists.data().agile;
      luckyCard = exists.data().lucky;

      for (let i = 0; i < itemId.length; i++) {
        // Find item
        item = await this.findItem(exists.data().items[i]);

        // Get item
        getItem = await item.get();

        // Get item data
        itemData = getItem.data();

        // get item property
        attackItem = itemData.attack;
        defenceItem = itemData.defence;
        agileItem = itemData.agile;
        luckyItem = itemData.lucky;

        // Calculate property after clear item
        attackCard = attackCard - attackItem;
        defenceCard = defenceCard - defenceItem;
        agileCard = agileCard - agileItem;
        luckyCard = luckyCard - luckyItem;

        //Check if it property lower than0
        this.notLowerThanZero(attackCard);
        this.notLowerThanZero(defenceCard);
        this.notLowerThanZero(agileCard);
        this.notLowerThanZero(luckyCard);
      }

      // Update card
      card.update({
        items: [],
        attack: attackCard,
        defence: defenceCard,
        agile: agileCard,
        lucky: luckyCard,
      });

      return {
        message: 'Clear item complete',
        data: {
          attack: attackCard,
          defence: defenceCard,
          agile: agileCard,
          lucky: luckyCard,
        },
      };
    }
    return { message: 'Item is empty' };
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

  notLowerThanZero(number: number) {
    if (number < 0)
      throw new HttpException(
        `Data is lower than 0 !!!`,
        HttpStatus.BAD_REQUEST,
      );
  }
}
