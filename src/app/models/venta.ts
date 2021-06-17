export class Venta {
  IdCliente: number;
  IdVenta: number;
  Fecha: string;
  ClienteNombre: string;
  Total: number;
};
export const Ventas: Venta[] = [
  {
    IdCliente: 1,
    IdVenta: 1,
    Fecha: '2014-10-02T20:29:18.197',
    ClienteNombre: 'SANCHEZ, JUAN CARLOS',
    Total: 3317.00
  },
  {
    IdCliente: 2,
    IdVenta: 2,
    Fecha: '2014-10-02T20:37:50.483',
    ClienteNombre: 'ROBLEDO, LUIS ARMANDO',
    Total: 25136.00
  } 
];
