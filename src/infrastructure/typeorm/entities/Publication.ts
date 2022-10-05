import { Entity } from 'typeorm';

import { CustomBaseEntity } from 'infrastructure/typeorm/entities/CustomBaseEntity';

@Entity({ name: 'publications' })
export class PublicationModel extends CustomBaseEntity {}
