import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Tecnico } from '../../../models/tecnico';
import { ChamadoService } from '../../../services/chamado.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-chamado-read',
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
  templateUrl: './chamado-read.component.html',
  styleUrl: './chamado-read.component.css'
})
export class ChamadoReadComponent implements OnInit {

  chamado: FormGroup;
  clientes: Cliente[] = [];
  tecnicos: Tecnico[] = [];

  constructor(
    private fb: FormBuilder,
    private chamadoService: ChamadoService,
    private toastService: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.chamado = this.fb.group({
      id: [null],
      prioridade: new FormControl({ value: '', disabled: true }),
      status: new FormControl({ value: '', disabled: true }),
      titulo: new FormControl({ value: '', disabled: true }),
      observacoes: new FormControl({ value: '', disabled: true }),
      tecnico: new FormControl({ value: '', disabled: true }),
      cliente: new FormControl({ value: '', disabled: true }),
      nomeCliente: new FormControl({ value: '', disabled: true }),
      nomeTecnico: new FormControl({ value: '', disabled: true })
    });
  }

  ngOnInit(): void {
    const chamadoId = this.route.snapshot.paramMap.get('id');
    if (chamadoId) {
      this.findById(chamadoId);
    }
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
