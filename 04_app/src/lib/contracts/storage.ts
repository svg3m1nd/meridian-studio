export type StoredObject={key:string;sha256:string;contentType:string;size:number};
export interface ObjectStorage{put(input:{key:string;bytes:Uint8Array;contentType:string}):Promise<StoredObject>;get(key:string):Promise<Uint8Array|null>;delete(key:string):Promise<void>}
