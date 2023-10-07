export interface Group {
    _id?: string;
    groupName: string;
}

export interface UserGroup {
  userID: string;
  roleID: string;
  groupID: string;
}
