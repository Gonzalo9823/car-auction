import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';
import { UserModel } from 'infrastructure/typeorm/entities/User';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenModel extends CustomBaseEntity {
  @Column()
  token!: string;

  @ManyToOne(() => UserModel, (user) => user.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user!: UserModel;
}
