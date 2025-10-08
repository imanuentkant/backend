export type PersistEntityType = 'user' | 'post' | 'media' | 'post_media';
export type PersistActionType = 'create' | 'update' | 'delete';

export type AsyncPersistCommand = {
  entity: PersistEntityType;
  action: PersistActionType;
  payload: any;
};

export interface AsyncPersistencePort {
  enqueue(command: AsyncPersistCommand): Promise<void>;
  enqueueMany(commands: AsyncPersistCommand[]): Promise<void>;
}
