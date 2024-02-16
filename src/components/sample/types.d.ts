export interface DateForms{
    NombreSolicitante:string,
    Documento:string,
    CorreoSolicitante:string,
    Dependencia:string,
    FechaIngreso:string,
    CorreoPersonal:string,
    TelefonoFijo:string,
    TelefonoCelular:string,
    DptoResidencia:string,
    CiudadResidencia:string,
    Direccion:string,
    Motivo:string,
    JefeInmediato:string,
    CargoJefeInmediato:string,
    CorreoJefeInmediato:string,
    Tercero:string,
    Estado:string,
    Area:string,
    AprobadorArea:string,
    CorreoAprobador:string,
    FechaAprobado:string,
    FechaLimite:string,
    Pendiente:string
}

export interface DateFormsTiempo{
    Tiempomax:number,
    Tiempomin:number,
    Escalatiempomax:string,
    Escalatiempomin:string,   
}
export interface Usert{
    Nombre:string,
    Correo:string,
    Cargo:string,
    Permisos:string   
}