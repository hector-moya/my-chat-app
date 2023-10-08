export interface Group {
    _id?: string;
    groupName: string;
    imageUrl?: string;
}

export interface UserGroup {
  userID: string;
  roleID: string;
  groupID: string;
}
