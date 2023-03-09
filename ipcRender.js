ipcRenderer.send('item-send-empleado')

ipcRenderer.send('qnasTodas')

ipcRenderer.on('resumen', (event, args)=>{

    
    exportaResumen(args.empleados, args.resumen )

})


ipcRenderer.on('servidor_a_cliente', (event, args) => {
    const acc = args.accion
    const data = args.data
    console.log("Accion: "+acc)
    switch (acc) {
        case 'canalShowAllEmpleados':
            listEmpleados = data
            itemsPrintEmpleados()
        break;
        case 'canalListChequeConceptos':
            listConceptos(data)
        break;
        case 'canalShowChequeConcepto':
            showChequeConcepto(data)
        break;
        case 'canalShowDetalleEmpleado':
            showDetalleEmpleado(data)
        break;
        case 'canalShowEmpleadoAddPago':
            showEmpleadoAddPago(data)
        break;
        case 'exporta-empleado':
            exportaEmpleados(data)
        break;
        case 'exporta-concepto':
            exportaChequeConceptos(data)
        break;
        case 'exporta-detalle':
            exportaDetalles(data)
        break;
        case 'canalListQnaProc':
            listQnaProc(data)
        break;
    
        // case 'resumen':
        //     console.log(args.accion)    
        // break;

    }
})