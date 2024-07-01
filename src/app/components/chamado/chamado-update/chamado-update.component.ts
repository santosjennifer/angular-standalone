import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { Tecnico } from '../../../models/tecnico';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chamado } from '../../../models/chamado';
import { ChamadoService } from '../../../services/chamado.service';
import { ClienteService } from '../../../services/cliente.service';
import { TecnicoService } from '../../../services/tecnico.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chamado-update',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './chamado-update.component.html',
  styleUrl: './chamado-update.component.css'
})
export class ChamadoUpdateComponent implements OnInit {

  chamado: FormGroup;
  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  constructor(
    private fb: FormBuilder,
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.chamado = this.fb.group({
      id: [null],
      prioridade: [null, Validators.required],
      status: [null, Validators.required],
      titulo: [null, Validators.required],
      observacoes: [null, Validators.required],
      tecnico: [null, Validators.required],
      cliente: [null, Validators.required],
      nomeCliente: [null],
      nomeTecnico: [null]
    });
  }

  ngOnInit(): void {
    const chamadoId = this.route.snapshot.paramMap.get('id');
    if (chamadoId) {
      this.findById(chamadoId);
    }
    this.findAllClientes();
    this.findAllTecnicos();
  }

  findById(id: string): void {
    this.chamadoService.findById(id).subscribe({
      next: (resposta) => {
        this.chamado.patchValue(resposta);
      },
      error: (ex) => {
        this.toastService.error(ex.error.error);
      }
    });
  }

  update(): void {
    if (this.chamado.valid) {
      const chamado: Chamado = this.chamado.value;
      this.chamadoService.update(chamado).subscribe({
        next: () => {
          this.toastService.success('Chamado atualizado com sucesso', 'Atualizar chamado');
          this.router.navigate(['chamados']);
        },
        error: (ex) => {
          this.toastService.error(ex.error.error);
        }
      });
    }
  }

  findAllClientes(): void {
    this.clienteService.findAll().subscribe(response => {
      this.clientes = response;
    });
  }

  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe(response => {
      this.tecnicos = response;
    });
  }

  validaCampos(): boolean {
    return this.chamado.valid;
  }

  retornaStatus(status: any): string {
    if (status == '0') {
      return 'ABERTO';
    } else if (status == '1') {
      return 'EM ANDAMENTO';
    } else {
      return 'ENCERRADO';
    }
  }

  retornaPrioridade(prioridade: any): string {
    if (prioridade == '0') {
      return 'BAIXA';
    } else if (prioridade == '1') {
      return 'MÉDIA';
    } else {
      return 'ALTA';
    }
  }
}