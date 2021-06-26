export interface Notas {
    nombre?: string;
    notaOrdinaria?: string;
    notaExtraordinaria?: string;
    asistenciaTotal?: number;
    notaFinalOrdinaria?: number;
    notaFinalExtraordinaria?: number;
    bonificacion?: number;
    aplica?: boolean;
    clase: string;
    fechaNota: Date;
    numeroUltimaNota: number;

}

export interface RespuestaBdNotas {
  ok: boolean;
  mensaje?: string;
  lista?: Notas[];
}

