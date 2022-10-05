import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';
import { PublicationModel } from 'infrastructure/typeorm/entities/Publication';
import { UserModel } from 'infrastructure/typeorm/entities/User';

@Entity({ name: 'bids' })
export class BidModel extends CustomBaseEntity {
  @ManyToOne(() => PublicationModel, (publication) => publication.bids, { nullable: false })
  @JoinColumn({ name: 'publication_id' })
  publication!: PublicationModel;

  @ManyToOne(() => UserModel, (user) => user.bids, { nullable: false })
  @JoinColumn({ name: 'bidder_id' })
  bidder!: UserModel;

  @Column({ name: 'bidded_at' })
  biddedAt!: Date;

  @Column({ type: 'real' })
  amount!: number;
}
