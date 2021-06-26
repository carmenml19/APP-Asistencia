export interface IAsistenciaOnline {
    name?: string;
    username?: string;
    role?: string;
    tipoAsistencia?: string;
    fechaEntrada?: string;
    fechaSalida?: string;
    tiempoTotal?: string;
    numeroAccesoClase?: string;
    clase: string;
    asiste?: boolean;
    valida: boolean;
}

export interface AddAsistencia {
  nombreClase: string;
  facultad: string;
  esAsistenciaOnline?: boolean;
}

export interface ClaseAsistencia {
  ok: string;
  mensaje: string;
  numeroClasesOnline: string;
  numeroClasesPresenciales: string;
}

