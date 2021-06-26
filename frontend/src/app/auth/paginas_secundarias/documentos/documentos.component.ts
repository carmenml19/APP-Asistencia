import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgxCsvParser } from 'projects/ngx-csv-parser/src/public-api';
import { NgxCSVParserError } from 'projects/ngx-csv-parser/src/public-api';
import { AddAsistencia, IAsistenciaOnline } from '../../../models/asistenciaOnline';
import { AsistenciaOnlServiceService } from '../../../services/asistencia-onl-service.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  claseSeleccionada: string;
  csvRecords: any[] = [];
  header = false;
  @ViewChild('fileImportInput', {static: false}) fileImportInput: any;


  constructor(private ngxCsvParser: NgxCsvParser,
              private asistenciaOnlineService: AsistenciaOnlServiceService,
              private usuarioService: AuthService,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    if (this.usuarioService.usuario === undefined || this.usuarioService.usuario === null) {
      this.usuarioService.logout();
    } else {
      const clase = await Swal.fire({
        title: 'Clases',
        input: 'select',
        allowOutsideClick: false,
        showCancelButton: true,
        inputOptions: {
          'Primero Informática': {
            '1-ALG-6': 'Álgebra Lineal',
            '2-FTC-4,5': 'Fundamentos de Computadores',
            '3-LAB-6': 'Laboratorio de Informática',
            '4-FP1-4,5': 'Fundamentos de Programación 1',
            '5-CAL-6': 'Cálculo',
            '6-TEO-3': 'Teología',
            '7-ETR-6' : 'Estructura de Computadores',
            '8-MAT-4,5': 'Matemática Discreta',
            '9-FIS-6': 'Física',
            '10-FP2-4,5': 'Fundamentos de Programación 2',
            '11-FAO-6': 'Fundamentos de Administración y Organización de Empresas',
            '12-ETC-3': 'Ética'

          },
          'Segundo Informática': {
            '1-ALG-4,5': 'Algoritmia',
            '2-BBD-6': 'Bases de Datos',
            '3-EST-6': 'Estadística',
            '4-POO-4,5': 'Programación Orientada a Objetos',
            '5-IPM-4,5': 'Interfaz Persona Máquina',
            '6-ALE-4,5': 'Aspectos Legales y Éticos de la Informática',
            '7-SSO-6': 'Sistemas Operativos',
            '8-PVA-6': 'Programación Visual Avanzada',
            '9-RCS-6': 'Redes de Computadores',
            '10-SGI-6': 'Sistemas de Gestión de la Información',
            '11-ISW-6': 'Ingeniería del Software'
          },
          'Tercero Informática': {
            '1–PGP-4,5': 'Programación Paralela',
            '2-DD1-4,5': 'Desarrollo de Aplicaciones Distribuidas 1',
            '3-IGR-4,5': 'Ingeniería de Requisitos',
            '4-TAC-6': 'Tecnologías Avanzadas de Comunicación',
            '5-SIE-6': 'Soluciones Informáticas para la Empresa',
            '6-AQC-4,5': 'Arquitectura de Computadores',
            '7-DD2-6': 'Desarrollo de Aplicaciones Distribuidas 2',
            '8-GPI-4,5': 'Gestión de Proyectos Informáticos',
            '9-MSW-6': 'Modelado del Software',
            '10-SIT-4,5': 'Sistemas Inteligentes',
            '11-SIF-4,5': 'Seguridad de la Información',
            '12-PGW-4,5': 'Programación Web'
          },
          'Cuarto Informática': {
            '1–ABD-4,5': 'Administración de Bases de Datos',
            '2-CSW-4,5': 'Calidad del Software',
            '3-ADM-4,5': 'Aplicaciones para Dispositivos Móviles',
            '4-ASI-6': 'Administración de Sistemas',
            '5-IGC-6': 'Ingeniería del Conocimiento',
            '6-PIS-6': 'Proyecto Integral de Ingeniería del Software',
            '7-AYP-4,5': 'Auditoría y Peritaje',
            '8-PIT-4,5': 'Proyecto Integral de Tecnologías de la Información',
            '9-TFG-18': 'Trabajo Fin de Grado'
          }
        },
        inputPlaceholder: 'Seleccine una clase',
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value !== '') {
              this.claseSeleccionada = value;
              resolve(null);
            } else {
              resolve('Necesita seleccionar una clase!');
            }
          });
        }
      });
      if (clase.value === undefined || clase.value === null ) {
        this.router.navigateByUrl('/home');
      } else {
        this.claseSeleccionada = clase.value;
        console.log('CLASE SELECCIONADA: ', this.claseSeleccionada);
      }
    }

  }




  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    // this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe((result: Array<any>) => {
        console.log('Result', result[0]);
        if (result[0][0].toString().toUpperCase() === 'NAME') {
          result.shift();
          this.csvRecords = result;
          this.csvRecords.sort((nota1, nota2) => {
            if (nota1[0].split(',')[0].split(' ')[0] > nota2[0].split(',')[0].split(' ')[0]) { //comparación lexicogŕafica
              return 1;
            } else if (nota1[0].split(',')[0].split(' ')[0] < nota2[0].split(',')[0].split(' ')[0]) {
              return -1;
            }
            return 0;
          });
          console.log('Result 2', result);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las cabeceras no coiniciden con el .csv esperado!',
            footer: 'Pruebe de nuevo, por favor.'
          });
        }


      }, (error: NgxCSVParserError) => {
        console.log('Error', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe de seleccionar una archivo .csv!',
          footer: 'Pruebe de nuevo, por favor.'
        });
      });
  }

  guardarDatos(): void {

    const arrayObjetos: IAsistenciaOnline[] = [];
    for (const persona of this.csvRecords) {
      for (const datos of persona){
        const aux = datos.split(',');
        const usuario: IAsistenciaOnline = {
          name: aux[0],
          username: aux[1],
          role: aux[2],
          tipoAsistencia: aux[3],
          fechaEntrada: aux[4],
          fechaSalida: aux[5],
          tiempoTotal: aux[6],
          numeroAccesoClase: aux[7],
          clase: this.claseSeleccionada.toString(),
          valida: this.validarTiempoEnClase(aux[6])
        };

        arrayObjetos.push(usuario);


      }
    }
    console.log('arrayObjetos:', arrayObjetos);
    this.asistenciaOnlineService.guardarArrayAsistenciaOnlineBD(arrayObjetos).then(resp => {
      console.log('respuesta bd: ', resp);
      this.csvRecords = [];
      const clase: AddAsistencia = {
        nombreClase: this.claseSeleccionada,
        facultad: this.usuarioService.usuario.facultad,
        esAsistenciaOnline: true
      };
      this.asistenciaOnlineService.addAsistenciaClase(clase).then( respu => {
        Swal.fire('¡Perfecto!', 'Asistencia guardada correctamente de ' + arrayObjetos.length + ' alumnos.', 'success');
      }).catch(error => {
        console.log('ERROR: ', error);
      });
    }).catch(error => {
      console.log('ERROR: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar la base de datos!',
        footer: 'Pruebe de nuevo, por favor.'
      });
    });

    console.log('array formado: ', arrayObjetos);

  }

  validarTiempoEnClase(tiempo: string): boolean {
    const aux = tiempo.split(':');
    const horas = parseInt(aux[0], 10);
    const minutos = parseInt(aux[1], 10);
    const segundos = parseInt(aux[2], 10);
    if (horas > 0) {
      return true;
    } else {
      if ( minutos >= 45){
        return true;
      } else {
        return false;
      }
    }

  }


}
