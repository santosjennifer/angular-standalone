import { Component, OnInit } from '@angular/core';
import { Tecnico } from '../../../models/tecnico';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TecnicoService } from '../../../services/tecnico.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-tecnico-create',
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
  templateUrl: './tecnico-create.component.html',
  styleUrl: './tecnico-create.component.css'
})
export class TecnicoCreateComponent implements OnInit {

  tecnico: FormGroup;

  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.tecnico = new FormGroup({
      nome: new FormControl('', [Validators.minLength(3), Validators.required]),
      cpf: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      senha: new FormControl('', [Validators.minLength(3), Validators.required]),
      perfis: new FormControl([2])
    });
  }

  ngOnInit(): void { }

  create(): void {
    if (this.tecnico.invalid) {
      this.toast.error('Formulário inválido, por favor verifique os campos.');
      return;
    }

    this.service.create(this.tecnico.value).subscribe({
      next: () => {
        this.toast.success('Técnico cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['tecnicos'])
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
      if (!this.tecnico.value.perfis.includes(perfil)) {
        this.tecnico.value.perfis.push(perfil);
      }
    } else {
      const index = this.tecnico.value.perfis.indexOf(perfil);
      if (index > -1) {
        this.tecnico.value.perfis.splice(index, 1);
      }
    }
  }

  validaCampos(): boolean {
    return this.tecnico.valid;
  }
}
