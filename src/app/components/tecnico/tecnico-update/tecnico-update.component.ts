import { Component, OnInit } from '@angular/core';
import { TecnicoService } from '../../../services/tecnico.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tecnico } from '../../../models/tecnico';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

enum Perfil {
  ADMIN = 0,
  CLIENTE = 1,
  TECNICO = 2
}

@Component({
  selector: 'app-tecnico-update',
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
  templateUrl: './tecnico-update.component.html',
  styleUrl: './tecnico-update.component.css'
})
export class TecnicoUpdateComponent implements OnInit {

  tecnico: Tecnico = {
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
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      this.tecnico = resposta;
      this.tecnico.perfis = this.tecnico.perfis.map(perfil => this.perfilMap[perfil as keyof typeof Perfil]);
      this.formGroup.patchValue(this.tecnico);
    });
  }

  update(): void {
    if (this.formGroup.valid) {
      const updatedTecnico = { ...this.tecnico, ...this.formGroup.value };
      this.service.update(updatedTecnico).subscribe({
        next: () => {
          this.toast.success('Técnico atualizado com sucesso', 'Update');
          this.router.navigate(['tecnicos']);
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
      if (!this.tecnico.perfis.includes(perfilCodigo)) {
        this.tecnico.perfis.push(perfilCodigo);
      }
    } else {
      const index = this.tecnico.perfis.indexOf(perfilCodigo);
      if (index > -1) {
        this.tecnico.perfis.splice(index, 1);
      }
    }
  }

  isPerfilChecked(perfil: keyof typeof Perfil): boolean {
    const perfilCodigo = this.perfilMap[perfil];
    return this.tecnico.perfis.includes(perfilCodigo);
  }

  validaCampos(): boolean {
    return this.formGroup.valid;
  }

}
