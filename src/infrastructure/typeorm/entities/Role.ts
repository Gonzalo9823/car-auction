import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { AvailableRole } from 'apps/role/domain/role';

import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';
import { GrantModel } from 'infrastructure/typeorm/entities/Grant';
import { UserModel } from 'infrastructure/typeorm/entities/User';

@Entity({ name: 'roles' })
export class RoleModel extends CustomBaseEntity {
  @Column({
    enum: AvailableRole,
    type: 'enum',
  })
  name!: AvailableRole;

  @ManyToMany(() => GrantModel, (grant) => grant.roles)
  @JoinTable({
    name: 'role_grants',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'grant_id',
      referencedColumnName: 'id',
    },
  })
  grants!: GrantModel[];

  @OneToMany(() => UserModel, (user) => user.role)
  users!: UserModel[];
}
