import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-create',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    NgxMaskDirective
  ],
  templateUrl: './cliente-create.component.html',
  styleUrl: './cliente-create.component.css'
})
export class ClienteCreateComponent implements OnInit {

  cliente: FormGroup;

  constructor(
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.cliente = new FormGroup({
      nome: new FormControl('', [Validators.minLength(3), Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      senha: new FormControl('', [Validators.minLength(3), Validators.required]),
      perfis: new FormControl([1])
    });
  }

  ngOnInit(): void { }

  create(): void {
    if (this.cliente.invalid) {
      this.toast.error('Formulário inválido, por favor verifique os campos.');
      return;
    }

    this.service.create(this.cliente.value).subscribe({
      next: () => {
        this.toast.success('Cliente cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['clientes'])
      },
      error: (ex) => {
        if (ex.error.errors) {
          ex.error.errors.forEach((element: { message: string }) => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      }
    });
  }

  addPerfil(perfil: any, isChecked: boolean): void {
    if (isChecked) {
      if (!this.cliente.value.perfis.includes(perfil)) {
        this.cliente.value.perfis.push(perfil);
      }
    } else {
      const index = this.cliente.value.perfis.indexOf(perfil);
      if (index > -1) {
        this.cliente.value.perfis.splice(index, 1);
      }
    }
  }

  validaCampos(): boolean {
    return this.cliente.valid;
  }
}

