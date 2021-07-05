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
      let clase: any;
      if (this.usuarioService.usuario.facultad.toString().toUpperCase() === 'INFORMATICA') {
        clase = await Swal.fire({
          title: 'Clases',
          input: 'select',
          allowOutsideClick: false,
          showCancelButton: true,
          inputOptions: {
            'INGENIERÍA INFORMÁTICA': {
              '1-SSO-6': 'Sistemas Operativos',
              '2-PVA-6': 'Programación Visual Avanzada',
              '3-RCS-6': 'Redes de Computadores', 
              '4–PGP-4,5': 'Programación Paralela' 
            },
            'ARQUITECTURA': {
              '1-EGI-6': 'Economía y Gestión Inmobiliaria',
              '2-FYF-4,5': 'Arquitectura Sostenible'
            },
            'BIOTECNOLOGÍA': {
              '1–BQM-4,5': 'Bioquímica Metabólica',
              '2-NTR-6': 'Nutrigenómica'
            }
          },
          inputPlaceholder: 'Seleccione una clase',
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
      } else {
        clase = await Swal.fire({
          title: 'Clases',
          input: 'select',
          allowOutsideClick: false,
          showCancelButton: true,
          inputOptions: {
            'MEDICINA': {
              '1-EMB-6': 'Embriología Humana',
              '2-OTO-4,5': 'Otorrinolaringología',
              '4-TXC-4,5': 'Toxicología Clínica'  
            },
            'FARMACIA': {
              '1-FPT-6': 'Fisiopatología',
              '2-FYF-4,5': 'Farmacognosia y Fitoterapia'
            },
            'FISIOTERAPIA': {
              '1–FPS-4,5': 'Farmacología para Fisioterapeutas',
              '2-CNS-6': 'Cinesiterapia',
              '3-BLG-6': 'Biología Humana',
              '4-VFN-4,5': 'Vendajes Funcionales y Neuromusculares'
            }
          },
          inputPlaceholder: 'Seleccione una clase',
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
      }
      

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
