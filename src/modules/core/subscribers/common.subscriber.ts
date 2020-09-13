import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class CommonSubscriber implements EntitySubscriberInterface {
  async beforeInsert(event: InsertEvent<any>) {
    if (!!event.entity) {
      const currentUserId = event.queryRunner.data.userId || 0;
      event.entity.createdUserId = event.entity.createdUserId || currentUserId;
    }
  }

  async beforeUpdate(event: InsertEvent<any>) {
    if (!!event.entity) {
      const currentUserId = event.queryRunner.data.userId || 0;
      event.entity.modifiedUserId =
        event.entity.modifiedUserId || currentUserId;
    }
  }
}
