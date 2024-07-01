import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { Tecnico } from '../../../models/tecnico';
import { TecnicoService } from '../../../services/tecnico.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tecnico-delete',
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
  templateUrl: './tecnico-delete.component.html',
  styleUrl: './tecnico-delete.component.css'
})
export class TecnicoDeleteComponent implements OnInit {

  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  perfilMap: { [key: string]: number } = {
    'ADMIN': 0,
    'CLIENTE': 1,
    'TECNICO': 2
  };

  formGroup: FormGroup = new FormGroup({
    nome: new FormControl({ value: '', disabled: true }, Validators.required),
    cpf: new FormControl({ value: '', disabled: true }, Validators.required),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
    senha: new FormControl({ value: '', disabled: true }, Validators.required),
    perfis: new FormControl({ value: [], disabled: true })
  });

  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.tecnico.id = this.route.snapshot.paramMap.get('id')!;
    this.findById();
  }

  findById(): void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      this.tecnico = resposta;
      this.tecnico.perfis = this.tecnico.perfis.map(perfil => this.perfilMap[perfil]);
      this.formGroup.patchValue(this.tecnico);
    });
  }

  delete(): void {
    this.service.delete(this.tecnico.id).subscribe({
      next: () => {
        this.toast.success('Técnico excluído com sucesso', 'Excluir');
        this.router.navigate(['tecnicos'])
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

  isPerfilChecked(perfil: keyof typeof this.perfilMap): boolean {
    const perfilCodigo = this.perfilMap[perfil];
    return this.tecnico.perfis.includes(perfilCodigo);
  }
}