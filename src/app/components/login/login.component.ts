import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Credenciais } from '../../models/credenciais';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  ngOnInit(): void { }

  email = new FormControl(null, [Validators.required, Validators.email]);
  senha = new FormControl(null, [Validators.required, Validators.minLength(3)]);

  constructor(
    private toast: ToastrService,
    private service: AuthService,
    private router: Router) { }

  logar() {
    const creds: Credenciais = {
      email: this.email.value!,
      senha: this.senha.value!
    };

    this.service.authenticate(creds).subscribe({
      next: (response) => {
        const authHeader = response.headers.get('Authorization');
        if (authHeader) {
          this.service.successfulLogin(authHeader.substring(7));
          this.router.navigate(['']);
        } else {
          this.toast.error('Erro ao processar a resposta do servidor');
        }
      },
      error: () => {
        this.toast.error('Usuário e/ou senha inválidos');
      }
    });
  }

  validaCampos(): boolean {
    return this.email.valid && this.senha.valid;
  }
}
