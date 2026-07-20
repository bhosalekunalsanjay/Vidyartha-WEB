import { UserStatus } from "../enums/UserStatus";

export const UserStatusOptions = [
  { value: UserStatus.INACTIVE, label: "INACTIVE" },
  { value: UserStatus.ACTIVE, label: "ACTIVE" },
  { value: UserStatus.DELETED, label: "DELETED" },
  { value: UserStatus.SUSPENDED, label: "SUSPENDED" },
];