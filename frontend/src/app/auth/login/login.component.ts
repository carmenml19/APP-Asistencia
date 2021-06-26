import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';
import { Router } from '@angular/router';
import { AuthService} from '../../services/auth.service';
import { UserI } from '../../models/user';
import Swal from 'sweetalert2';



interface ErrorValidate {
  [s: string]: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  forma: FormGroup;

  constructor( private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.crearFormulario();

  }

  ngOnInit(): void {
  }



  onLogin(form): void{
  //  console.log('email: ', form.form.value.email);
  //  console.log('pass: ', form.form.value.password);

    const usuario: UserI = {
      email: form.form.value.email,
      password: form.form.value.password
    };

    this.authService.login(usuario).then( resp => {
      console.log('RESPUESTA LOGIN EMAIL: ', resp);
      this.authService.usuario = resp.dataUser;
      if (resp.dataUser.email !== undefined) {
        this.authService.saveToken(resp.dataUser.accessToken, resp.dataUser.expiresIn);
        this.router.navigateByUrl('/home');
      } else {
        this.forma.get('password').setValue('');
      }

    }).catch(error => {
      console.log('error: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Contraseña o Usuario Incorrectos!',
        footer: 'Pruebe de nuevo, por favor.'
      });
    });

  }


  emailNoValido(): boolean{
    return  this.forma.get('email').touched && this.forma.get('email').invalid;
  }

  passwordNoValido(): boolean{
    return this.forma.get('password').touched && this.forma.get('password').invalid;
  }

  crearFormulario(): void{
    this.forma = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    });
  }


 guardar(): void{
   console.log(this.forma);

   if (this.forma.invalid){
     return Object.values(this.forma.controls).forEach(control => {
      control.markAsTouched();
     });
   }
  }
}
