import { collection, CollectionReference } from 'firebase/firestore'
import DBService from './db-service'

export abstract class AbstractDBService<T> {
  protected _collectionRef: CollectionReference

  constructor(collectionName: string) {
    this._collectionRef = collection(DBService.db, collectionName)
  }

  get collectionRef() {
    return this._collectionRef
  }

  getAll(): Promise<T[]> {
    throw new Error('This method has not yet been implemented for this Type')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  upsert(_document: T): Promise<void> {
    throw new Error('This method has not yet been implemented for this Type')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(_id: string): Promise<void> {
    throw new Error('This method has not yet been implemented for this Type')
  }
}
