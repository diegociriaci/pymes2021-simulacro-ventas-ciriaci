import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Venta } from "../../models/venta";
import { VentasService } from "../../services/ventas.service";
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: "app-ventas",
  templateUrl: "./ventas.component.html",
  styleUrls: ["./ventas.component.css"]
})
export class VentasComponent implements OnInit {
  Titulo = "Ventas";
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de ventas (buscar con parametros)
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

  Items: Venta[] = [];
  RegistrosTotal: number;
  Pagina = 1; // inicia pagina 1

  constructor(
   public formBuilder: FormBuilder,
   private ventasService: VentasService,
   private modalDialogService: ModalDialogService
  ) {}
  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;

  submitted: boolean = false;

  ngOnInit() { this.FormBusqueda = this.formBuilder.group({
      Nombre: [null],
    });
      this.FormRegistro = this.formBuilder.group({
      IdCliente: [null],
      IdVenta: [null],
      ClienteNombre: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      Total: [null, [Validators.required, Validators.pattern("[0-9]{1,7}")]  ],
      Fecha: [null, [Validators.required, Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
]  ],
    });

      }

  Agregar() {
    this.AccionABMC = "A";
    this.FormRegistro.reset({Id: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();

  }

// Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    this.ventasService.get().subscribe((res: any) => {
        this.Items = res;
        this.RegistrosTotal = res.RegistrosTotal;
      });
  }

  // Obtengo un registro especifico según el Id
  BuscarPorId(Dto, AccionABMC) {
    window.scroll(0, 0); // ir al incio del scroll
    this.ventasService.getById(Dto.IdVenta).subscribe((res: any) => {
      this.FormRegistro.patchValue(res);

      //formatear fecha de  ISO 8061 a string dd/MM/yyyy
      var arrFecha = res.Fecha.substr(0, 10).split('-');
      this.FormRegistro.controls.Fecha.patchValue(
        arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0]
      );
      this.AccionABMC = AccionABMC;
    });
  }

  Consultar(Dto) {
    this.BuscarPorId(Dto, "C");
  }

// comienza la modificacion, luego la confirma con el metodo Grabar
  Modificar(Dto) {
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
    this.BuscarPorId(Dto, 'M');
  }

// grabar tanto altas como modificaciones
  Grabar() {
  this.submitted = true;
     // verificar que los validadores esten OK
     if (this.FormRegistro.invalid) {
      return;
     }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };
 
    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.Fecha.substr(0, 10).split("/");
    if (arrFecha.length == 3)
      itemCopy.Fecha = 
          new Date(
            arrFecha[2],
            arrFecha[1] - 1,
            arrFecha[0]
          ).toISOString();
 
    // agregar post
    if (this.AccionABMC == "A") {
      this.ventasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      this.ventasService
        .put(itemCopy.IdVenta, itemCopy)
        .subscribe((res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.Buscar();
        });
    }
  }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }
  ImprimirListado() {
    this.modalDialogService.Alert
 ('Sin desarrollar...');
  }
}
