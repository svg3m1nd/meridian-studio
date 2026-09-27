export type JobEnvelope<T>={eventId:string;eventVersion:number;organizationId:string;workspaceId:string;idempotencyKey:string;correlationId:string;payload:T};
export interface JobQueue{enqueue<T>(topic:string,job:JobEnvelope<T>):Promise<{jobId:string}>}
