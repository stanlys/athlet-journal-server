export enum IRole {
  admin = 0,
  athlete = 1,
  trainer = 2,
  moderator = 3,
}

export class UpdateUserDTO {
  readonly login: string;

  readonly city: string;

  readonly icon: string;

  readonly surname: string;

  readonly role: IRole;
}
