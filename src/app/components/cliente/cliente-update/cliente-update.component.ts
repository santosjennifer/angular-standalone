import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { Cliente } from '../../../models/cliente';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../../services/cliente.service';

enum Perfil {
  ADMIN = 0,
  CLIENTE = 1,
  TECNICO = 2
}

@Component({
  selector: 'app-cliente-update',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgxMaskDirective,
    MatCheckboxModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './cliente-update.component.html',
  styleUrl: './cliente-update.component.css'
})
export class ClienteUpdateComponent implements OnInit {

  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  perfilMap = Perfil;

  formGroup: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.minLength(3)]),
    cpf: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.email]),
    senha: new FormControl(null, [Validators.minLength(3)])
  });

  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe(resposta => {
      this.cliente = resposta;
      this.cliente.perfis = this.cliente.perfis.map(perfil => this.perfilMap[perfil as keyof typeof Perfil]);
      this.formGroup.patchValue(this.cliente);
    });
  }

  update(): void {
    if (this.formGroup.valid) {
      const updatedCliente = { ...this.cliente, ...this.formGroup.value };
      this.service.update(updatedCliente).subscribe({
        next: () => {
          this.toast.success('Cliente atualizado com sucesso', 'Update');
          this.router.navigate(['clientes']);
        },
        error: (ex) => {
          if (ex.error.errors) {
            ex.error.errors.forEach((element: any) => {
              this.toast.error(element.message);
            });
          } else {
            this.toast.error(ex.error.message);
          }
        }
      });
    }
  }

  addPerfil(perfil: keyof typeof Perfil, isChecked: boolean): void {
    const perfilCodigo = this.perfilMap[perfil];
    if (isChecked) {
      if (!this.cliente.perfis.includes(perfilCodigo)) {
        this.cliente.perfis.push(perfilCodigo);
      }
    } else {
      const index = this.cliente.perfis.indexOf(perfilCodigo);
      if (index > -1) {
        this.cliente.perfis.splice(index, 1);
      }
    }
  }

  isPerfilChecked(perfil: keyof typeof Perfil): boolean {
    const perfilCodigo = this.perfilMap[perfil];
    return this.cliente.perfis.includes(perfilCodigo);
  }

  validaCampos(): boolean {
    return this.formGroup.valid;
  }
}

