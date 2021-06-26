export interface IAsistencia {
    name?: string;
    username?: string;
    role?: string;
    tipoAsistencia?: string;
    fechaEntrada?: string;
    fechaSalida?: string;
    tiempoTotal?: string;
    numeroAccesoClase?: string;
    asiste?: boolean;
    clase?: string;
}

export interface RespuestaBDListarAlumnos {
  respuesta?: string;
  mensaje?: string;
  lista:  string[];
}

export interface RespuestaBDListarAsistencia {
  respuesta?: string;
  mensaje?: string;
  lista: IAsistencia[];
}
