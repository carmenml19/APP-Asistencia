import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
              private usuarioService: AuthService) { }

  ngOnInit(): void {
  }

  salir(): void {
    this.usuarioService.usuario = null;
    this.usuarioService.logout();
    this.router.navigateByUrl('/login');
  }

}
