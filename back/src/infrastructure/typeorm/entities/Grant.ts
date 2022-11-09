import { Column, Entity, ManyToMany } from 'typeorm';

import { AvailableGrant } from 'apps/core/domain/grant';

import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';
import { RoleModel } from 'infrastructure/typeorm/entities/Role';

@Entity({ name: 'grants' })
export class GrantModel extends CustomBaseEntity {
  @Column({
    enum: AvailableGrant,
    type: 'enum',
  })
  name!: AvailableGrant;

  @ManyToMany(() => RoleModel, (role) => role.grants)
  roles!: RoleModel[];
}
