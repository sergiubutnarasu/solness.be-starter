export type BaseActionType = 'view' | 'create' | 'update' | 'delete';

export type UserActionType = BaseActionType;
export type CompanyActionType = BaseActionType | 'inviteUser' | 'excludeUser';
