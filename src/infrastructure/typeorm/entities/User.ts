import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';
import { RefreshTokenModel } from 'infrastructure/typeorm/entities/RefreshToken';
import { RoleModel } from 'infrastructure/typeorm/entities/Role';

@Entity({ name: 'users' })
export class UserModel extends CustomBaseEntity {
  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'encrypted_password' })
  encryptedPassword!: string;

  @ManyToOne(() => RoleModel, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role!: RoleModel;

  @OneToMany(() => RefreshTokenModel, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshTokenModel[];
}
