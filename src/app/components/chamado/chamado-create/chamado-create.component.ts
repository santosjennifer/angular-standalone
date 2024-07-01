import { Component, OnInit } from '@angular/core';
import { ChamadoService } from '../../../services/chamado.service';
import { ClienteService } from '../../../services/cliente.service';
import { TecnicoService } from '../../../services/tecnico.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cliente } from '../../../models/cliente';
import { Tecnico } from '../../../models/tecnico';
import { Chamado } from '../../../models/chamado';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-chamado-create',
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
  templateUrl: './chamado-create.component.html',
  styleUrl: './chamado-create.component.css'
})
export class ChamadoCreateComponent implements OnInit {

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
  ) {
    this.chamado = this.fb.group({
      prioridade: [null, Validators.required],
      status: [null, Validators.required],
      titulo: [null, Validators.required],
      observacoes: [null, Validators.required],
      tecnico: [null, Validators.required],
      cliente: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.findAllClientes();
    this.findAllTecnicos();
  }

  create(): void {
    if (this.chamado.valid) {
      const chamado: Chamado = this.chamado.value;
      this.chamadoService.create(chamado).subscribe({
        next: () => {
          this.toastService.success('Chamado criado com sucesso', 'Novo chamado');
          this.router.navigate(['chamados']);
        }, error: (ex) => {
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

}
