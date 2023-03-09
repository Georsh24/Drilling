var listEmpleados = []

function itemsPrintEmpleados() {
    document.querySelector("#table_datos_empleados").innerHTML = ""
    for (i = 0; i < listEmpleados.length; i++) {
        var table = document.querySelector("#table_datos_empleados");
        var tr = document.createElement('tr');
        tr.setAttribute("style", " text-align: center;")
        var td = tr.appendChild(document.createElement('td'));
        td.innerHTML = listEmpleados[i].rfc;

        td = tr.appendChild(document.createElement('td'));
        td.innerHTML = listEmpleados[i].nombre;

        td = tr.appendChild(document.createElement('td'));
        td.innerHTML = listEmpleados[i].categoria;

        td = tr.appendChild(document.createElement('td'));
        td.innerHTML = listEmpleados[i].act_inact;

        td = tr.appendChild(document.createElement('td'));
        span = document.createElement("span")
        span.setAttribute("style", "margin-right: 5px; color: #4da196;")
        a = document.createElement("i")
        a.classList.add("fa-solid", "fa-pencil")
        a.innerHTML = ""
        span.appendChild(a)
        td.appendChild(span)
        a = document.createElement("a")
        a.setAttribute("id", listEmpleados[i].rfc)
        a.addEventListener("click", empleadoShow)
        a.setAttribute("class", 'linkp')
        a.setAttribute("href", "#")
        a.innerHTML = "Editar / "
        td.appendChild(a)
        span = document.createElement("span")
        span.setAttribute("style", "margin-right: 5px; color: #a14d6c;")
        a = document.createElement("i")
        a.classList.add("fa-solid", "fa-trash")

        a.innerHTML = ""
        span.appendChild(a)
        td.appendChild(span)
        a = document.createElement("a")
        a.setAttribute("id", listEmpleados[i].rfc)
        a.addEventListener("click", itemDeleteEmpleado)
        a.setAttribute("class", 'linkp')
        a.setAttribute("href", "#")
        a.innerHTML = "Eliminar"
        td.appendChild(a)


        td = tr.appendChild(document.createElement('td'));

        span = document.createElement("span")
        span.setAttribute("style", "margin-right: 5px; color: #4d62a1;")

        a = document.createElement("i")
        a.classList.add("fa-solid", "fa-plus")

        a.innerHTML = ""
        span.appendChild(a)
        td.appendChild(span)
        a = document.createElement("a")
        a.setAttribute("id", listEmpleados[i].rfc)
        a.addEventListener("click", agregarPago)
        a.setAttribute("class", 'linkp')
        a.setAttribute("href", "#")
        a.innerHTML = "Agregar / "
        td.appendChild(a)

        span = document.createElement("span")
        span.setAttribute("style", "margin-right: 5px; color: #595959;")

        a = document.createElement("i")
        a.classList.add("fa-solid", "fa-eye")

        a.innerHTML = ""
        span.appendChild(a)
        td.appendChild(span)
        a = document.createElement("a")
        a.setAttribute("id", listEmpleados[i].rfc)
        a.setAttribute("href", "#collapseExample")
        a.setAttribute("class", 'linkp')
        a.addEventListener("click", empleadoShowConceptos)
        a.innerHTML = "Ver"
        td.appendChild(a)
        table.appendChild(tr)
    }
}


function empleadoShow(event) {
    item = event.target
    var itemID = item.getAttribute("id")
    var args = new Object()
    args.id = itemID
    args.accion = "editar"
    ipcRenderer.send('cliente_a_servidor', {"accion":"selectEmpleado","args":args})
}


//editarEmpleado
//ipcRenderer.on('get-empleado', (event, data) => {
function showDetalleEmpleado (data){
    modalClearEmpleado()
    if (data && data.length == 1) {
        document.querySelector("[name=id_empleado_empleado]").value = data[0].id
        document.querySelector("[name=rfc_empleado]").value = data[0].rfc
        document.querySelector("[name=rfc_empleado]").setAttribute('readonly', true);
        document.querySelector("[name=curp_empleado]").value = data[0].curp
        document.querySelector("[name=nombre_empleado]").value = data[0].nombre
        document.querySelector("[name=apellido1_empleado]").value = data[0].apellido1
        document.querySelector("[name=apellido2_empleado]").value = data[0].apellido2
        document.querySelector("[name=categoria_empleado]").value = data[0].categoria
        document.querySelector("[name=ini_real_empleado]").value = data[0].ini_real

        const options = document.querySelector('[name=act_inact_empleado]').options
        for (let i = 0; i < options.length; i++) {
            if (options[i].value == data[0].act_inact) {
                options[i].selected = true
                break
            }
        }
    }
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevoEmpleado')).show(); // Returns a Bootstrap modal instance
}
//})


function itemDeleteEmpleado(event) {
    item = event.target
    var itemID = item.getAttribute("id")
    listEmpleados.find(function (value, index) {
        if (value && value.rfc == itemID) {
            listEmpleados.splice(index, 1)
            ipcRenderer.send('cliente_a_servidor', {"accion":"deleteEmpleado","args":itemID})
            itemsPrintEmpleados()
        }
    })
}


ipcRenderer.on('Correcto', (event, data) => {
    alert(`${data}`, 'success')
})

ipcRenderer.on('Incorrecto', (event, data) => {
    alert(`${data}`, 'danger')
})



//crea empleado
function itemCreateEmpleado() {
    id_empleado = document.querySelector("[name=id_empleado_empleado]")
    rfc = document.querySelector("[name=rfc_empleado]")
    curp = document.querySelector("[name=curp_empleado]")
    nombre = document.querySelector("[name=nombre_empleado]")
    apellido1 = document.querySelector("[name=apellido1_empleado]")
    apellido2 = document.querySelector("[name=apellido2_empleado]")
    categoria = document.querySelector("[name=categoria_empleado]")
    act_inact = document.querySelector('[name=act_inact_empleado]').options[document.querySelector('[name=act_inact_empleado]').selectedIndex]
    ini_real = document.querySelector("[name=ini_real_empleado]")

    let regex_rfc =
    "^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
    "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
    "[0-9A-Z]{2}[0-9A]{1}$"

    let regex_curp =
    "^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}" +
    "(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])" +
    "[HM]{1}" +
    "(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)" +
    "[B-DF-HJ-NP-TV-Z]{3}" +
    "[0-9A-Z]{1}[0-9]{1}$";

          
    if (rfc.value.trim().toUpperCase().match(regex_rfc)
        && curp.value.trim().toUpperCase().match(regex_curp)
        && nombre.value.trim() != ""
        && apellido1.value.trim() != ""
        && apellido2.value.trim() != ""
        && categoria.value.trim() != ""
        && act_inact.value.trim() != ""
        && ini_real.value.trim() != ""
    ) {
        let obj = new Object()
        obj.id_empleado = id_empleado.value.trim().toUpperCase()
        obj.rfc = rfc.value.trim().toUpperCase()
        obj.curp = curp.value.trim().toUpperCase()
        obj.nombre = nombre.value.trim().toUpperCase()
        obj.apellido1 = apellido1.value.trim().toUpperCase()
        obj.apellido2 = apellido2.value.trim().toUpperCase()
        obj.categoria = categoria.value.trim().toUpperCase()
        obj.act_inact = act_inact.value.trim().toUpperCase()
        obj.ini_real = ini_real.value.trim().toUpperCase()

        ipcRenderer.send('cliente_a_servidor', {"accion":"insertUpdateEmpleado","args":obj})
        ipcRenderer.send('item-send-empleado')

        modalClearEmpleado()
        bootstrap.Modal.getInstance(document.getElementById('modalNuevoEmpleado')).hide();
        //alert('Se modifico con exito', 'success')
    }
    else {
        console.log("Error de Validación")
        alert('Error, Revisar campos', 'danger')
    }
}


document.querySelector("#form-item-empleado").addEventListener("submit", createItemEmpleado)
function createItemEmpleado(event) {
    event.preventDefault()
    itemCreateEmpleado()
}

// Limpia los Campos del Modal 
function modalClearEmpleado() {
    document.querySelector("[name=id_empleado_empleado]").value = "0"
    document.querySelector("[name=rfc_empleado]").value = ""
    document.querySelector("[name=curp_empleado]").value = ""
    document.querySelector("[name=nombre_empleado]").value = ""
    document.querySelector("[name=apellido1_empleado]").value = ""
    document.querySelector("[name=apellido2_empleado]").value = ""
    document.querySelector("[name=categoria_empleado]").value = ""
    document.querySelector('[name=act_inact_empleado]').options[0].selected = true
    document.querySelector("[name=ini_real_empleado]").value = ""
    document.querySelector("[name=rfc_empleado]").removeAttribute('readonly');
}

document.getElementById('modalNuevoEmpleado').addEventListener('hidden.bs.modal', function () {
    console.log('CLOSE MODAL');
    modalClearEmpleado()
})

document.getElementById('modalNuevoEmpleado').addEventListener('shown.bs.modal', function () {
    console.log('OPEN MODAL');
})
function addQnaProc() {
    let qna = document.querySelector("[name=qna_proc]").value.trim()
    console.log(qna)

    let regex_qna =
    "^(2021|2022|2023)" +
    "(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24)$";

    if(qna.match(regex_qna)) {
        console.log("CORRECTA")
        ipcRenderer.send('cliente_a_servidor', {"accion":"insertQnaProc","args":qna})
        bootstrap.Modal.getInstance(document.getElementById('modalQna')).hide();
    }
    else {
        console.log("INCORRECTA")

    }
}

document.getElementById('modalQna').addEventListener('hidden.bs.modal', function () {
    console.log('CLOSE MODAL');
    document.querySelector("[name=qna_proc]").value = ""
})


function listQnaProc(data) {


    //document.querySelector("[name=qna_proc]").value.trim()
    var myParent = document.body;


//Create and append select list
var selectList = document.createElement("select");
selectList = document.querySelector("[name=qna]")
selectList.innerHTML = ""

//myParent.appendChild(selectList);

//Create and append the options
for (var i = 0; i < data.length; i++) {
    var option = document.createElement("option");
    option.value = data[i];
    option.text = data[i];
    selectList.appendChild(option);
}

}

