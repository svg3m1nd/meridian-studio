export function selectOrganizationMembership<T extends {organizationId:string}>(memberships:readonly T[],requestedOrganizationId:string|undefined):T|undefined{
 return memberships.find(membership=>membership.organizationId===requestedOrganizationId)??memberships[0];
}
