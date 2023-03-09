const db = require('electron-db');
const { ipcMain, BrowserWindow, dialog, ipcRenderer } = require("electron");
const path = require('path')
const location = path.join('./db', '')


ipcMain.on('cliente_a_servidor', (event, params) => {
    const acc = params.accion
    const args = params.args
    console.log("Accion: " + acc)
    switch (acc) {
        case 'insertUpdateConcepto':
            if (args.rfc.trim() != "" && args.curp.trim() != "" && args.nombre.trim() != "" && args.apellido1.trim() != "" && args.apellido2.trim() != "" && args.categoria.trim() != "") {
                if (args.id_concepto == "0")
                    this.item_save_concepto(args)
                else
                    this.item_update_concepto(args)
            }
            break;
        case 'selectEmpleado':
            this.empleado_get(args)
            break;
        case "selectChequeConcepto":
            this.concepto_get(args)
            break;
        case "deleteConcepto":
            this.item_delete_concepto(args)
            break;
        case "selectChequeConceptoYDetalle":
            this.concepto_get_detalle(args)
            break;
        case "deleteEmpleado":
            this.item_delete_empleado(args)
            break;
        case "exporta-excel":
            this.tomaEmpleados(args)
            this.exportaResumen(args)
            break;
        case "exporta-excel-detalle":
            this.tomaDetalles(args)
            break;
        case "exporta-excel-concepto":
            this.tomaConceptos(args)
            break;
        case "insertQnaProc":
            this.add_qna(args)
            break;
        case "selectQnasProc":
            this.allQnas(args)
            break;


        case "insertUpdateEmpleado":
            if (args.rfc.trim() != "" && args.curp.trim() != "" && args.nombre.trim() != "" && args.apellido1.trim() != "" && args.apellido2.trim() != "" && args.categoria.trim() != "" && args.act_inact.trim() != "" && args.ini_real.trim() != "") {
                if (args.id_empleado == "0")
                    this.item_save_empleado(args)
                else
                    this.item_update_empleado(args)
            }
            break;
    }
})

module.exports.allQnas = function (args) {
    db.createTable('tabla_qna_proc', location, (succ, msg) => {
        /*console.log("Success: " + succ);
        console.log("Message: " + msg);*/
    })
    db.getAll('tabla_qna_proc', location, (succ, data) => {
        if (data.length > 0) {
            let qnas = []
            data.forEach(e => {
                qnas.push(e.qna_proc)
                //if (num< e.num_cons) num = e.num_cons;
            })
            this.envia_data('canalListQnaProc', qnas.sort().reverse())
        }
    })
}

module.exports.add_qna = function (args) {
    db.createTable('tabla_qna_proc', location, (succ, msg) => {
        /*console.log("Success: " + succ);
        console.log("Message: " + msg);*/
    })

    db.getRows('tabla_qna_proc', location, { qna_proc: args }, (succ, data) => {
        if (data.length == 0) {
            let obj = new Object()
            obj.qna_proc = args
            db.insertTableContent('tabla_qna_proc', location, obj, (succ, msg) => {
                /*console.log("Success: " + succ);
                console.log("Message: " + msg);*/
                //this.mensaje_alerta(succ)
                this.mensaje_alerta(succ)
            })
        }
    })
    db.getAll('tabla_qna_proc', location, (succ, data) => {
        if (data.length > 0) {
            let qnas = []
            data.forEach(e => {
                qnas.push(e.qna_proc)
            })
            this.envia_data('canalListQnaProc', qnas.sort().reverse())
        }
    })
}

module.exports.crea_tabla_conceptos_qna = function (tabla) {
    db.createTable(tabla, location, (succ, msg) => {
        console.log("Success: " + succ);
        console.log("Message: " + msg);
    })
}

module.exports.create_db = function () {
    db.createTable('tabla_empleados', location, (succ, msg) => {
        console.log("Success: " + succ);
        console.log("Message: " + msg);
    })
}


module.exports.empleado_get = function (args) {
    db.getRows('tabla_empleados', location, { rfc: args.id }, (succ, data) => {
        if (data.length > 0) {
            if (args.accion == "editar") {
                this.envia_data('canalShowDetalleEmpleado', data)
            } else {
                this.envia_data('canalShowEmpleadoAddPago', data)
            }
        }
    })
}

module.exports.item_all_empleados = function () {
    db.getAll('tabla_empleados', location, (succ, data) => {
        if (data.length > 0) {
            this.envia_data('canalShowAllEmpleados', data)
        }
    })
}





module.exports.concepto_get_detalle = function (args) {
    let qna = args.qna_proc
    let tabla = 'tabla_conceptos_' + qna
    this.crea_tabla_conceptos_qna(tabla)
    db.getRows(tabla, location, { id: (parseInt(args.id)) }, (succ, data) => {
        if (data.length > 0) {
            this.envia_data('canalShowChequeConcepto', data)
        }

    })
}

module.exports.concepto_get = function (args) {
    let qna = args.qna_proc
    let tabla = 'tabla_conceptos_' + qna
    this.crea_tabla_conceptos_qna(tabla)
    db.getRows(tabla, location, { rfc: args.id }, (succ, data) => {
        if (data.length > 0) {
            this.envia_data('canalListChequeConceptos', data)
        }

    })
}

module.exports.item_save_empleado = function (args) {
    let obj = new Object()
    obj.rfc = args.rfc
    obj.curp = args.curp
    obj.nombre = args.nombre
    obj.apellido1 = args.apellido1
    obj.apellido2 = args.apellido2
    obj.categoria = args.categoria
    obj.edo_nac = 10
    obj.act_inact = args.act_inact
    obj.ini_real = args.ini_real
    db.getRows('tabla_empleados', location, { rfc: args.rfc }, (succ1, data1) => {
        if (data1.length == 0) {
            console.log("NO EXISTE:" + args.rfc);
            db.insertTableContent('tabla_empleados', location, obj, (succ, msg) => {
                console.log("Success: " + succ);
                console.log("Message: " + msg);
                this.mensaje_alerta(succ)
            })

        }
        else {
            console.log("EXISTE:" + args.rfc);
        }
    })
}

module.exports.item_update_empleado = function (args) {
    let where = {
        "id": parseInt(args.id_empleado)
    }
    let set = new Object()
    set.rfc = args.rfc
    set.curp = args.curp
    set.nombre = args.nombre
    set.apellido1 = args.apellido1
    set.apellido2 = args.apellido2
    set.categoria = args.categoria
    set.edo_nac = 10
    set.act_inact = args.act_inact
    set.ini_real = args.ini_real
    db.updateRow('tabla_empleados', location, where, set, (succ, msg) => {
        console.log("Success: " + succ)
        console.log("Message: " + msg)
        this.mensaje_alerta(succ)
    })
}

module.exports.item_delete_empleado = function (id) {
    db.deleteRow('tabla_empleados', location, { 'rfc': id }, (succ, msg) => {
        if (succ) {
            db.deleteRow('tabla_conceptos', location, { 'rfc': id }, (succ2, msg) => {
            })
            this.mensaje_alerta(succ)
        }
    })
}




module.exports.item_save_concepto = function (args) {
    let qna = args.qna_proc
    let tabla = 'tabla_conceptos_' + qna
    this.crea_tabla_conceptos_qna(tabla)

    db.getAll(tabla, location, (succ, data) => {
        let num = 0
        data.forEach(e => {
            if (num < e.num_cons) num = e.num_cons;
        })
        num = parseInt(num) + 1;
        let obj = new Object()
        obj.rfc = args.rfc
        obj.curp = args.curp
        obj.nombre = args.nombre
        obj.apellido1 = args.apellido1
        obj.apellido2 = args.apellido2
        obj.categoria = args.categoria
        obj.tot_perc_cheque = args.tot_perc_cheque
        obj.tot_ded_cheque = args.tot_ded_cheque
        obj.tot_net_cheque = args.tot_net_cheque
        obj.num_cons = num
        obj.conceptos = args.conceptos
        db.insertTableContent(tabla, location, obj, (succ, msg) => {
            console.log("Success: " + succ);
            console.log("Message: " + msg);
            this.mensaje_alerta(succ)
        })
    })
}

module.exports.item_update_concepto = function (args) {

    let qna = args.qna_proc
    let tabla = 'tabla_conceptos_' + qna
    this.crea_tabla_conceptos_qna(tabla)
    let where = {
        "id": parseInt(args.id_concepto)
    }
    let set = new Object()
    set.rfc = args.rfc
    set.curp = args.curp
    set.nombre = args.nombre
    set.apellido1 = args.apellido1
    set.apellido2 = args.apellido2
    set.categoria = args.categoria
    set.tot_perc_cheque = args.tot_perc_cheque
    set.tot_ded_cheque = args.tot_ded_cheque
    set.tot_net_cheque = args.tot_net_cheque
    set.num_cons = parseInt(args.num_cons)
    set.conceptos = args.conceptos
    db.updateRow(tabla, location, where, set, (succ, msg) => {
        console.log("Success: " + succ);
        console.log("Message: " + msg);
        this.mensaje_alerta(succ)
    })
}

module.exports.item_delete_concepto = function (args) {
    let qna = args.qna_proc
    let tabla = 'tabla_conceptos_' + qna
    this.crea_tabla_conceptos_qna(tabla)

    db.deleteRow(tabla, location, { 'id': parseInt(args.id) }, (succ, msg) => {
        console.log("Success: " + succ);
        console.log("Message: " + msg);
        this.mensaje_alerta(succ)
    })
}


module.exports.mensaje_alerta = function (succ) {
    const win = BrowserWindow.getFocusedWindow()
    if (succ) {
        win.webContents.send('Correcto', "Almacenamiento Correcto")
    }
    else {
        win.webContents.send('Incorrecto', "Ha ocurrido un error")
    }
}

module.exports.envia_data = function (accion, data) {
    const win = BrowserWindow.getFocusedWindow()
    win.webContents.send('servidor_a_cliente', { "accion": accion, "data": data })
}
//conceptosDetallesResumen = []
module.exports.tomaDetalles = async function (args) {
    let qna = args.qna_proc
    let tabla = 'tabla_conceptos_' + qna
    var conceptosDetalles = []
    db.getAll(tabla, location, (succ, data) => {

        data.forEach(element => {
            element.conceptos.forEach(element2 => {
                element2.num_cons = element.num_cons
                conceptosDetalles.push(element2)
            });
        });

        return conceptosDetalles
    })
    let conceptosDetalles2 = await conceptosDetalles
    this.envia_data('exporta-detalle', conceptosDetalles2)
}
//tabla = []
module.exports.tomaConceptos = function (args) {
    let qna = args.qna_proc
    let tabla = 'tabla_conceptos_' + qna

    db.getAll(tabla, location, (succ, data) => {
        if (data) {
            this.envia_data('exporta-concepto', data)
        } else {
            console.log("vacia")
        }
   
    })
  
}

module.exports.tomaEmpleados = async function (args) {

    let qna = args.qna_proc
    let tabla = 'tabla_empleados'
    var Activos = []
    db.getAll(tabla, location, (succ, data) => {
        var inactivos = []
        emp_cons = 1
        data.forEach((element, index) => {
            element.num_cons = emp_cons + index
            if (element.act_inact == 'A') {
                Activos.push(element)

            } else {
                inactivos.push(element)
            }
        });
        return Activos
    })
    let activos2 = await Activos
    this.envia_data('exporta-empleado', activos2)
}
module.exports.exportaResumen = async function (args) {
    let qna = args.qna_proc
    let tablaConceptos = 'tabla_conceptos_' + qna
    let tabla = 'tabla_empleados'
    var Activos = []
  var resumenpd = []

        db.getAll(tablaConceptos, location, (succ, data) => {
            if (data.length > 0) {
                let percepciones = []
                let deducciones = []
                data.forEach(dat => {
                    dat.conceptos.forEach(con => {
                        if (con.percded == 'P') {          
                            let index = percepciones.findIndex(per => (per.percded == con.percded && per.cpto == con.cpto))
                            if (index > -1) {
                                percepciones[index].importe = parseFloat(percepciones[index].importe) + parseFloat(con.importe)
                            }
                            else {
                                percepciones.push(con)
                            }
                        }	
                        else {
                            let index = deducciones.findIndex(ded => (ded.percded == con.percded && ded.cpto == con.cpto))
                            if (index > -1) {
                                deducciones[index].importe = parseFloat(deducciones[index].importe) + parseFloat(con.importe)
                            }
                            else {
                                deducciones.push(con)
                            }
                        }
                    })
                })
                percepciones.sort((a,b)=> (a.cpto > b.cpto ? 1 : -1))
                deducciones.sort((a,b)=> (a.cpto > b.cpto ? 1 : -1))
                resumenpd = percepciones.concat(deducciones)
            }
        })
    
   //             element2.num_cons = element.num_cons
    //             conceptosDetalles.push(element2)
    //         });
    //     });
    //     return conceptosDetalles
    // })

    // db.getAll(tablaConceptos, location, (succ, data) => {
    //    datos = data
    //     return datos
    // })    // db.getAll(tablaConceptos, location, (succ, data) => {
    //     data.forEach(element => {
    //         element.conceptos.forEach(element2 => {
 

    db.getAll(tabla, location, (succ, data) => {
        var inactivos = []
        emp_cons = 1
        data.forEach((element, index) => {
            element.num_cons = emp_cons + index
            if (element.act_inact == 'A') {
                Activos.push(element)

            } else {
                inactivos.push(element)
            }
        });

        return Activos
    })
    let activos2 = await Activos
    let resumenpd2 = resumenpd
    const win = BrowserWindow.getFocusedWindow()
    win.webContents.send('resumen', { "accion": "resumen", "empleados": activos2, "resumen":resumenpd2})
}

