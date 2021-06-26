import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './auth/inicio/inicio.component';
import { LoginComponent } from './auth/login/login.component';
import { DocumentosComponent } from './auth/paginas_secundarias/documentos/documentos.component';
import { ManualComponent } from './auth/paginas_secundarias/asistenciaManual/manual.component';
import { TotalAlumnosComponent } from './auth/paginas_secundarias/asistenciaTotal/totalAlumnos.component';
import { ActasComponent } from './auth/paginas_secundarias/actas/actas.component';

const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent},
    { path: 'home', component: InicioComponent },
    { path: 'manual', component: ManualComponent},
    { path: 'totalAlumnos', component: TotalAlumnosComponent},
    { path: 'documentos', component: DocumentosComponent},
    { path: 'actas', component: ActasComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
