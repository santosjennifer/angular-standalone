import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cliente-delete',
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
  templateUrl: './cliente-delete.component.html',
  styleUrl: './cliente-delete.component.css'
})
export class ClienteDeleteComponent implements OnInit {

  cliente: Cliente = {
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
    private service: ClienteService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.cliente.id = this.route.snapshot.paramMap.get('id')!;
    this.findById();
  }

  findById(): void {
    this.service.findById(this.cliente.id).subscribe(response => {
      this.cliente = response;
      this.cliente.perfis = this.cliente.perfis.map(perfil => this.perfilMap[perfil]);
      this.formGroup.patchValue(this.cliente);
    });
  }

  delete(): void {
    this.service.delete(this.cliente.id).subscribe({
      next: () => {
        this.toast.success('Cliente excluído com sucesso', 'Excluir');
        this.router.navigate(['clientes'])
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
    return this.cliente.perfis.includes(perfilCodigo);
  }
}
