import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { InicioComponent } from './auth/inicio/inicio.component';
import { FooterComponent } from './auth/footer/footer.component';
import { HeaderComponent } from './auth/header/header.component';
import { ManualComponent } from './auth/paginas_secundarias/asistenciaManual/manual.component';
import { DocumentosComponent } from './auth/paginas_secundarias/documentos/documentos.component';


// Rutas

import { RouterModule } from '@angular/router';

// Servicios
import { InicioService } from './services/inicio.servicios';

import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { TotalAlumnosComponent } from './auth/paginas_secundarias/asistenciaTotal/totalAlumnos.component';
import { ActasComponent } from './auth/paginas_secundarias/actas/actas.component';
import { PruebaComponent } from './paginas_secundarias/prueba/prueba.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    FooterComponent,
    HeaderComponent,
    DocumentosComponent,
    ManualComponent,
    TotalAlumnosComponent,
    ActasComponent,
    PruebaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
   /* AuthModule.forRoot({
      domain: 'carmenml19.us.auth0.com',
      clientId: 'j24f5uPz4j2PoFO5VXDCbV27U3sh3Hqx'
    })*/
  ],
 providers: [
    InicioService,
    AuthService
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
