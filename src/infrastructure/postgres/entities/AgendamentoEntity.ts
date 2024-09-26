// TypeORM
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm'

// Domain
import { TAgendamentoModel } from '../../../domain/agendamento/AgendamentoModel'

// Constantes
import { cTABELA_AGENDAMENTO } from '../constants/ConstantesPostgres'
import UsuarioEntity from './UsuarioEntity'

@Entity({ name: cTABELA_AGENDAMENTO })
export default class AgendamentoEntity implements TAgendamentoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = ''

  @Column({ name: 'sttaus', length: 255, nullable: false })
  status: string = ''

  @Column({ name: 'frequencia', length: 255, nullable: false })
  frequencia: string = ''

  @Column({ name: 'tipoAgendamento', length: 255, nullable: false })
  tipoAgendamento: string = ''

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.id)
  @Column({ name: 'usuarioCriacaoId', length: 255, nullable: false })
  usuarioCriacaoId: string = ''

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.id)
  @Column({ name: 'usuarioAlteracaoId', length: 255, nullable: false })
  usuarioAlteracaoId: string = ''

  @CreateDateColumn({ name: 'criadoEm' })
  criadoEm: Date = new Date()

  @UpdateDateColumn({ name: 'alteradoEm' })
  alteradoEm: Date = new Date()
}
