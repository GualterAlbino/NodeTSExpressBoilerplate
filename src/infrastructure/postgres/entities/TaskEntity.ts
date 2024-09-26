// TypeORM
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'

// Domain
import { TTaskModel } from '../../../domain/task/TaskModel'

// Constantes
import { cTABELA_TASK } from '../constants/ConstantesPostgres'

@Entity({ name: cTABELA_TASK })
export default class TaskEntity implements TTaskModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = ''

  @Column({ name: 'sttaus', length: 255, nullable: false })
  status: string = ''

  @Column({ name: 'mensagem', length: 255, nullable: false })
  mensagem: string = ''

  @Column({ name: 'percentual', nullable: false })
  percentual: number = 0

  @Column({ name: 'frequencia', length: 255, nullable: false })
  frequencia: string = ''

  @Column({ name: 'tipoAgendamento', length: 255, nullable: false })
  tipoAgendamento: string = ''

  @ManyToOne(() => TaskEntity, (task) => task.id)
  @Column({ name: 'agendamentoId', length: 255, nullable: false })
  agendamentoId: string = ''

  @CreateDateColumn({ name: 'criadoEm' })
  criadoEm: Date = new Date()

  @UpdateDateColumn({ name: 'alteradoEm' })
  alteradoEm: Date = new Date()
}
