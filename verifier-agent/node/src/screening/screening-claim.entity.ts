import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Screening } from './screening.entity';

@Entity()
export class ScreeningClaim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  value: string;

  @ManyToOne(() => Screening, (screening) => screening.claims)
  screening: Screening;
}
