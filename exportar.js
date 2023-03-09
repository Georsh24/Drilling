// genera Carpeta de exportacion si no existe

//var dir2 = './Datos';
var dir3 = './db';

// if (!fs.existsSync(dir2)) {
//     fs.mkdirSync(dir2);
// }
if (!fs.existsSync(dir3)) {
    fs.mkdirSync(dir3);
}

//importa librerias de xlsx
const XLSX = require('xlsx');
const path = require('path');

//Construlle Encabezados
const workSheetColumnNameConcepto = [
    "u_version",
    "num_cons",
    "tipo_nomina",
    "tipo_calculo",
    "unidad",
    "rfc",
    "nom_emp",
    "ent_ed",
    "ct_clasif",
    "ct_id",
    "ct_secuencial",
    "ct_digito_ver",
    "cod_pago",
    "unidad",
    "subunidad",
    "cat_puesto",
    "horas",
    "cons_plaza",
    "niv_puesto",
    "nivel_sueldo",
    "grupo_nomina",
    "mot_mov",
    "qna_ini",
    "qna_fin",
    "qna_pago",
    "qna_proc",
    "cons_qna_proc",
    "num_cheque",
    "cheque_dv",
    "tot_perc_cheque",
    "tot_ded_cheque",
    "tot_net_cheque",
];

const workSheetColumnNameEmpleado = [
    "u_version",
    "rfc",
    "curp",
    "nom_emp",
    "apellido1",
    "apellido2",
    "categoria",
    "sexo",
    "edo_civil",
    "edo_nac",
    "qna_ini",
    "act_inac",
    "ban_pago",
    "mot_baja",
    "qna_baja",
    "qna_ing_gob",
    "qna_ing_sep",
    "nip_academico",
    "tipo_tit",
    "tipo_lic",
    "num_tit",
    "num_lic",
    "emp_cta_sar",
    "acumulado_horas_42",
    "acumulado_horas_48",
    "emp_dom",
    "emp_dom_col",
    "emp_dom_pob",
    "emp_dom_cp",
    "emp_cta_bamcaria",
    "bco_admdor",
    "bco_plaza",
    "ini_real",
    "emp_cons",
    "cot_pens"
];

const workSheetColumnNameDetalle = [
    "u_version",
    "num_cons",
    "perc_ded",
    "concepto",
    "importe",
    "qna_ini",
    "qna_fin"
];

qna_proc_export = ""
function getQnaProc() {
    qna_proc_export = document.getElementById("qna_proc").value
    localStorage.setItem("qna_proc", qna_proc_export)
}

function exportaExcel() {
    
    var args = new Object()
    args.qna_proc = document.querySelector("[name=qna]").value
    ipcRenderer.send('cliente_a_servidor', { "accion": "exporta-excel", "args": args })
}

function exportaEmpleados(empleados) {
    const EmpleadoList = empleados
    // if (qna_proc_export.length === 0 || qna_proc_export.value == 'null' || qna_proc == "" || qna_proc_export.value == '' || qna_proc.length == 0 || qna_proc.value == "") {
    //     alert('QNA Proceso Vacía o Sin Guardar', 'danger')
    // } else {
    //     //alert('QNA Proceso Guardada Exportando...', 'success')
    //     if (isNaN(qna_proc_export)) {
    //         alert('QNA Proceso Debe ser Numerico', 'danger')
    //     } else {
    var args = new Object()
    args.qna_proc = document.querySelector("[name=qna]").value
    let qna_proc = localStorage.getItem("qna_proc")
    const workSheetNameEmpleado = 'empleado_' + args.qna_proc;
    var filePathEmpleado = 'C:\\Datos\\empleado_' + args.qna_proc + '.xlsx';
    exportEmpleadosToExcel(EmpleadoList, workSheetColumnNameEmpleado, workSheetNameEmpleado, filePathEmpleado),
        ipcRenderer.send('cliente_a_servidor', { "accion": "exporta-excel-concepto", "args": args })

    //     }
    // }
}

function exportaChequeConceptos(conceptos) {
    const ConceptosList = conceptos
    let qna_proc = localStorage.getItem("qna_proc")
    var args = new Object()
    args.qna_proc = document.querySelector("[name=qna]").value
    const workSheetNameConcepto = 'cheque_concepto_' + args.qna_proc;
    var filePathConcepto = 'C:\\Datos\\cheque_concepto_' + args.qna_proc + '.xlsx';
    exportConceptosToExcel(ConceptosList, workSheetColumnNameConcepto, workSheetNameConcepto, filePathConcepto),
        ipcRenderer.send('cliente_a_servidor', { "accion": "exporta-excel-detalle", "args": args })

}

function exportaResumen(empleados, resumen) {
    let Percepciones = 0
    let Deducciones = 0
    let TotalNeto = 0
console.log("resumen")
    console.log(resumen)
 
    document.getElementById("tabla_resumen").innerHTML = ""
    for (i = 0; i < resumen.length; i++) {
        console.log("valor i")
        console.log(i)
        console.log(resumen[i].importe)
        
        var table = document.querySelector("#tabla_resumen");
      
        var tr = document.createElement('tr');
        tr.setAttribute("style", " text-align: center;")
        var td = tr.appendChild(document.createElement('td'));
        td.innerHTML = resumen[i].percded;
        td = tr.appendChild(document.createElement('td'));
        td.innerHTML = resumen[i].cpto;
        td = tr.appendChild(document.createElement('td'));
        td.innerHTML = "$" + Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(resumen[i].importe))
        table.appendChild(tr)

        if (resumen[i].percded == 'P') {
            Percepciones = Percepciones + parseFloat(resumen[i].importe)
            console.log(Percepciones)
        } else {
            Deducciones = Deducciones + parseFloat(resumen[i].importe)
        }
    }
    TotalNeto = Percepciones - Deducciones
    console.log(Percepciones)
    document.getElementById("TotalPercepciones").innerHTML = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(Percepciones))
    document.getElementById("TotalDeducciones").innerHTML =  Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(Deducciones))
     
    document.getElementById("TotalNeto").innerHTML = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(TotalNeto))
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalQna2')).show(); //
}

function exportaDetalles(conceptosDetalles) {
    const DetalleList = conceptosDetalles
    var args = new Object()
    args.qna_proc = document.querySelector("[name=qna]").value
    const workSheetNameDetalle = 'cheque_concepto_detalle_' + args.qna_proc;
    var filePathDetalle = 'C:\\Datos\\cheque_concepto_detalle_' + args.qna_proc + '.xlsx';
    exportDetalleToExcel(DetalleList, workSheetColumnNameDetalle, workSheetNameDetalle, filePathDetalle),
        alert('Exportación con exito de los archivos ', 'success')
    shell.openPath('C:\\Datos');
    localStorage.removeItem("qna_proc")
    localStorage.setItem("qna_proc", "")
}



// Exporta Empleados Activos
const exportEmpleadosToExcel = (EmpleadoList, workSheetColumnNameEmpleado, workSheetNameEmpleado, filePathEmpleado) => {
    const data = EmpleadoList.map(Empleado => {
        return [
            "A",
            Empleado.rfc,
            Empleado.curp,
            Empleado.nombre,
            Empleado.apellido1,
            Empleado.apellido2,
            Empleado.categoria,
            "*",
            "0",
            "10",
            "0",
            "A",
            "1",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "*",
            "*",
            "*",
            "0",
            "0",
            "1",
            "1",
            Empleado.ini_real,
            Empleado.num_cons,
            "T"
        ];
    });
    const workBookEmpleado = XLSX.utils.book_new();
    const workBookEmpleadoPro = XLSX.utils.book_new();
    const workSheetDataEmpleado = [
        workSheetColumnNameEmpleado,
        ...data
    ];
    const workSheetDataEmpleadoPro = [
        ...data
    ];
    const workSheetEmpleado = XLSX.utils.aoa_to_sheet(workSheetDataEmpleado);
    const workSheetEmpleadoPro = XLSX.utils.aoa_to_sheet(workSheetDataEmpleadoPro);
    XLSX.utils.book_append_sheet(workBookEmpleado, workSheetEmpleado, workSheetNameEmpleado);
    XLSX.utils.book_append_sheet(workBookEmpleadoPro, workSheetEmpleadoPro, workSheetNameEmpleado);
    XLSX.writeFile(workBookEmpleado, path.resolve(filePathEmpleado));
    XLSX.writeFile(workBookEmpleadoPro, path.resolve(filePathEmpleado.replace(".xlsx", ".csv")), { FS: "}" });
    var fs = require('fs');
    fs.rename(filePathEmpleado.replace(".xlsx", ".csv"), filePathEmpleado.replace(".xlsx", ".txt"), function (err) {
        if (err) console.log('ERROR: ' + err);
    });
    return true;
};
//Exporta Cheque Concepto
const exportConceptosToExcel = (ConceptoList, workSheetColumnNameConcepto, workSheetNameConcepto, filePathConcepto) => {
    var args = new Object()
    args.qna_proc = document.querySelector("[name=qna]").value
    const data = ConceptoList.map(Concepto => {

        return [
            "A",
            Concepto.num_cons,
            "0",
            "1",
            "0",
            Concepto.rfc,
            Concepto.nombre + " " + Concepto.apellido1 + " " + Concepto.apellido2,
            "58",
            "A",
            "01",
            "1",
            "B",
            "3",
            "11",
            "1",
            "CA04001",
            "0",
            Concepto.num_cons,
            "0",
            "1",
            "0",
            "95",
            args.qna_proc,
            args.qna_proc,
            args.qna_proc,
            args.qna_proc,
            "0",
            Concepto.num_cons,
            "0",
            Concepto.tot_perc_cheque.replace(',',''),
            Concepto.tot_ded_cheque.replace(',',''),
            Concepto.tot_net_cheque.replace(',',''),
        ];
    });
    const workBookConcepto = XLSX.utils.book_new();
    const workBookConceptoPro = XLSX.utils.book_new();
    const workSheetDataConcepto = [
        workSheetColumnNameConcepto,
        ...data
    ];
    const workSheetDataConceptoPro = [
        ...data
    ];
    const workSheetConcepto = XLSX.utils.aoa_to_sheet(workSheetDataConcepto);
    const workSheetConceptoPro = XLSX.utils.aoa_to_sheet(workSheetDataConceptoPro);
    XLSX.utils.book_append_sheet(workBookConcepto, workSheetConcepto, workSheetNameConcepto);
    XLSX.utils.book_append_sheet(workBookConceptoPro, workSheetConceptoPro, workSheetNameConcepto);
    XLSX.writeFile(workBookConcepto, path.resolve(filePathConcepto));
    XLSX.writeFile(workBookConceptoPro, path.resolve(filePathConcepto.replace(".xlsx", ".csv")), { FS: "}" });
    var fs = require('fs');
    fs.rename(filePathConcepto.replace(".xlsx", ".csv"), filePathConcepto.replace(".xlsx", ".txt"), function (err) {
        if (err) console.log('ERROR: ' + err);
    });
    return true;
};
//Exporta Cheque Concepto Detalle 
const exportDetalleToExcel = (DetalleList, workSheetColumnNameDetalle, workSheetNameDetalle, filePathDetalle) => {
    var args = new Object()
    args.qna_proc = document.querySelector("[name=qna]").value
    const data = DetalleList.map(Detalle => {
        return [
            "A",
            Detalle.num_cons,
            Detalle.percded,
            Detalle.cpto,
            Detalle.importe,
            args.qna_proc,
            args.qna_proc
        ]
    })

    const workBookDetalle = XLSX.utils.book_new();
    const workBookDetallePro = XLSX.utils.book_new();
    const workSheetDataDetalle = [
        workSheetColumnNameDetalle,
        ...data
    ];
    const workSheetDataDetallePro = [
        ...data
    ];
    const workSheetDetalle = XLSX.utils.aoa_to_sheet(workSheetDataDetalle);
    const workSheetDetallePro = XLSX.utils.aoa_to_sheet(workSheetDataDetallePro);
    XLSX.utils.book_append_sheet(workBookDetalle, workSheetDetalle, workSheetNameDetalle);
    XLSX.utils.book_append_sheet(workBookDetallePro, workSheetDetallePro, workSheetNameDetalle);
    XLSX.writeFile(workBookDetalle, path.resolve(filePathDetalle));
    XLSX.writeFile(workBookDetallePro, path.resolve(filePathDetalle.replace(".xlsx", ".csv")), { FS: "}" });
    var fs = require('fs');
    fs.rename(filePathDetalle.replace(".xlsx", ".csv"), filePathDetalle.replace(".xlsx", ".txt"), function (err) {
        if (err) console.log('ERROR: ' + err);
    });
    return true;
};
