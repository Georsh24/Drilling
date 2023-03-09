const templateElemet = (pd, cpt, imp, position) => {
    let c = pd + '' + cpt
    return (`
    <div class="card-body">
    <div class="row">
    <div class="col-12">
        <div class="row">
            <div class="col-sm-3">
                <p class ="pconceptos"><strong>P/D</strong></p>
                <p  class ="pconceptos">${pd}</p>
            </div> 
            <div class="col-sm-3">
                <p class ="pconceptos"><strong>Concepto</strong></p>
                <p  class ="pconceptos"> ${cpt}</p>
            </div> 
            <div class="col-sm-3">
                <p  class ="pconceptos"><strong>Importe</strong> </p>
                <p  class ="pconceptos">$${Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(imp))}</p>
            </div>   
            <div class="col-sm-3"> 
            <button type="button" onclick="removeElement(event, '${c}')" class="btn " data-dismiss="alert" aria-label="Close">
               ❌
             </button>
        </div>                                             
        </div>
                                                      
    </div>    
</div>
    
    </div>
        `
    )
}


function agregarPago() {
    item = event.target
    var itemID = item.getAttribute("id")
    var args = new Object()
    args.id = itemID
    args.accion = "pago"
    ipcRenderer.send('cliente_a_servidor', { "accion": "selectEmpleado", "args": args })
}

function showEmpleadoAddPago(data) {
    modalClearConceptos()
    if (data && data.length == 1) {
        document.querySelector("[name=id_concepto]").value = "0"//data[0].id
        document.querySelector("[name=rfc]").value = data[0].rfc
        document.querySelector("[name=rfc]").setAttribute('readonly', true);
        document.querySelector("[name=curp]").value = data[0].curp
        document.querySelector("[name=curp]").setAttribute('readonly', true);
        document.querySelector("[name=nombre]").value = data[0].nombre
        document.querySelector("[name=nombre]").setAttribute('readonly', true);
        document.querySelector("[name=apellido1]").value = data[0].apellido1
        document.querySelector("[name=apellido1]").setAttribute('readonly', true);
        document.querySelector("[name=apellido2]").value = data[0].apellido2
        document.querySelector("[name=apellido2]").setAttribute('readonly', true);
        document.querySelector("[name=categoria]").value = data[0].categoria
        document.querySelector("[name=categoria]").setAttribute('readonly', true);
        document.querySelector("[name=tot_perc_cheque]").setAttribute('readonly', true);
        document.querySelector("[name=tot_ded_cheque]").setAttribute('readonly', true);
        document.querySelector("[name=tot_net_cheque]").setAttribute('readonly', true);
    }
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevoConcepto')).show(); // Returns a Bootstrap modal instance
}

function itemCreateConcepto() {
    id_concepto = document.querySelector("[name=id_concepto]")
    rfc = document.querySelector("[name=rfc]")
    curp = document.querySelector("[name=curp]")
    nombre = document.querySelector("[name=nombre]")
    apellido1 = document.querySelector("[name=apellido1]")
    apellido2 = document.querySelector("[name=apellido2]")
    categoria = document.querySelector("[name=categoria]")
    tot_perc_cheque = document.querySelector("[name=tot_perc_cheque]")
    tot_ded_cheque = document.querySelector("[name=tot_ded_cheque]")
    tot_net_cheque = document.querySelector("[name=tot_net_cheque]")
    num_cons = document.querySelector("[name=num_cons]")

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
        && tot_perc_cheque.value.trim() != ""
        && tot_perc_cheque.value.trim() != ""
        && tot_perc_cheque.value.trim() != ""
    ) {
        var obj = new Object()
        obj.id_concepto = id_concepto.value.trim().toUpperCase()
        obj.rfc = rfc.value.trim().toUpperCase()
        obj.curp = curp.value.trim().toUpperCase()
        obj.nombre = nombre.value.trim().toUpperCase()
        obj.apellido1 = apellido1.value.trim().toUpperCase()
        obj.apellido2 = apellido2.value.trim().toUpperCase()
        obj.categoria = categoria.value.trim().toUpperCase()
        obj.tot_perc_cheque = tot_perc_cheque.value.trim()
        obj.tot_ded_cheque = tot_ded_cheque.value.trim()
        obj.tot_net_cheque = tot_net_cheque.value.trim()
        obj.conceptos = cptos2
        obj.num_cons = num_cons.value.trim()

        obj.qna_proc = document.querySelector('[name=qna]').options[document.querySelector('[name=qna]').selectedIndex].value


        ipcRenderer.send('cliente_a_servidor', { "accion": "insertUpdateConcepto", "args": obj })
        ipcRenderer.send('item-send-concepto')
        modalClearConceptos()
        bootstrap.Modal.getInstance(document.getElementById('modalNuevoConcepto')).hide();

        let col = document.getElementById('collapseExample')
        col.className = ''
        col.className = 'collapse false'
    }
    else {
        alert('Error, Revisar campos', 'danger')
    }
}


document.querySelector("#form-item").addEventListener("submit", createConcepto)
function createConcepto(event) {
    event.preventDefault()
    itemCreateConcepto()
}

function modalClearConceptos() {
    document.querySelector("[name=num_cons]").value = "0"
    document.querySelector("[name=id_concepto]").value = "0"
    document.querySelector("[name=rfc]").value = ""
    document.querySelector("[name=curp]").value = ""
    document.querySelector("[name=nombre]").value = ""
    document.querySelector("[name=apellido1]").value = ""
    document.querySelector("[name=apellido2]").value = ""
    document.querySelector("[name=categoria]").value = ""
    document.querySelector("[name=divElements]").innerHTML = ""
    document.querySelector("[name=div2Elements]").innerHTML = ""
    document.querySelector("[name=rfc]").removeAttribute('readonly');
    document.querySelector("[name=curp]").removeAttribute('readonly');
    document.querySelector("[name=nombre]").removeAttribute('readonly');
    document.querySelector("[name=apellido1]").removeAttribute('readonly');
    document.querySelector("[name=apellido2]").removeAttribute('readonly');
    document.querySelector("[name=categoria]").removeAttribute('readonly');
    document.querySelector("[name=percded]").value = ""
    document.querySelector("[name=cpto]").value = ""
    document.querySelector("[name=importe]").value = ""
    document.querySelector("[name=tot_perc_cheque]").value = ""
    document.querySelector("[name=tot_ded_cheque]").value = ""
    document.querySelector("[name=tot_net_cheque]").value = ""
    cptos2 = []
}


function empleadoShowConceptos(event) {
    item = event.target
    var itemID = item.getAttribute("id")
    item = event.targe
    var args = new Object()
    args.id = itemID
    args.accion = "editar"
    args.qna_proc = document.querySelector('[name=qna]').options[document.querySelector('[name=qna]').selectedIndex].value
    ipcRenderer.send('cliente_a_servidor', { "accion": "selectChequeConcepto", "args": args })
}




function listConceptos(data) {
    document.querySelector("#table_datos").innerHTML = ""
    if (data.length == 0) {
        new bootstrap.Collapse(document.getElementById('collapseExample'), { toggle: false })
    }
    else {
        new bootstrap.Collapse(document.getElementById('collapseExample'), { toggle: true })
        list = data
        itemsPrintConceptos()
    }
}


function itemsPrintConceptos() {
    document.querySelector("#table_datos").innerHTML = ""
    for (i = 0; i < list.length; i++) {
        var table = document.querySelector("#table_datos");
        var tr = document.createElement('tr');
        tr.setAttribute("style", " text-align: center;")
        var td = tr.appendChild(document.createElement('td'));
        td.innerHTML = list[i].rfc;

        td = tr.appendChild(document.createElement('td'));
        td.innerHTML = list[i].nombre;

        td = tr.appendChild(document.createElement('td'));
        td.innerHTML = "$" + list[i].tot_perc_cheque;

        td = tr.appendChild(document.createElement('td'));
        td.innerHTML = "$" + list[i].tot_ded_cheque;

        td = tr.appendChild(document.createElement('td'));
        // td.innerHTML ="$"+ Intl.NumberFormat('en-US', {minimumFractionDigits: 2}).format(parseFloat(list[i].tot_net_cheque))
        td.innerHTML = "$" + list[i].tot_net_cheque;
        // "$"+ list[i].tot_net_cheque;
        // td = tr.appendChild(document.createElement('td'));
        //  td.innerHTML = list[i].act_inact;
        td = tr.appendChild(document.createElement('td'));


        span = document.createElement("span")
        span.setAttribute("style", "margin-right: 5px; color: #4da196;")

        a = document.createElement("i")
        a.classList.add("fa-solid", "fa-pencil")

        a.innerHTML = ""
        span.appendChild(a)
        td.appendChild(span)
        a = document.createElement("a")
        a.setAttribute("id", list[i].id)
        a.setAttribute("href", "#")
        a.setAttribute("class", 'linkp')
        a.addEventListener("click", empleadoShowConceptoDetalle)

        a.innerHTML = "Editar / "

        td.appendChild(a)


        //td = tr.appendChild(document.createElement('td'));
        
        span = document.createElement("span")
        span.setAttribute("style", "margin-right: 5px; color: #a14d6c;")

        a = document.createElement("i")
        a.classList.add("fa-solid", "fa-trash")

        a.innerHTML = ""
        span.appendChild(a)
        td.appendChild(span)
        a = document.createElement("a")
        a.setAttribute("id", list[i].id)
        a.addEventListener("click", itemDeleteConcepto)
        a.setAttribute("class", 'linkp')
        a.setAttribute("href", "#")
        a.innerHTML = "Eliminar"
        td.appendChild(a)
        table.appendChild(tr)
    }
}



function itemDeleteConcepto(event) {
    item = event.target
    var itemID = item.getAttribute("id")
    list.find(function (value, index) {
        if (value && value.id == itemID) {
            list.splice(index, 1)
            itemsPrintConceptos()

            var args = new Object()
            args.id = itemID
            args.qna_proc = document.querySelector('[name=qna]').options[document.querySelector('[name=qna]').selectedIndex].value
            ipcRenderer.send('cliente_a_servidor', { "accion": "deleteConcepto", "args": args })
        }
    })
}

function empleadoShowConceptoDetalle(event) {
    item = event.target
    var itemID = item.getAttribute("id")
    var args = new Object()
    args.id = itemID
    args.accion = "editar concepto"
    args.qna_proc = document.querySelector('[name=qna]').options[document.querySelector('[name=qna]').selectedIndex].value
    ipcRenderer.send('cliente_a_servidor', { "accion": "selectChequeConceptoYDetalle", "args": args })
}



//ipcRenderer.on('get-concepto', (event, data) => {
function showChequeConcepto(data) {
    modalClearConceptos()
    if (data && data.length == 1) {
        document.querySelector("[name=id_concepto]").value = data[0].id
        document.querySelector("[name=rfc]").value = data[0].rfc
        document.querySelector("[name=rfc]").setAttribute('readonly', true);
        document.querySelector("[name=curp]").value = data[0].curp
        document.querySelector("[name=curp]").setAttribute('readonly', true);
        document.querySelector("[name=nombre]").value = data[0].nombre
        document.querySelector("[name=nombre]").setAttribute('readonly', true);
        document.querySelector("[name=apellido1]").value = data[0].apellido1
        document.querySelector("[name=apellido1]").setAttribute('readonly', true);
        document.querySelector("[name=apellido2]").value = data[0].apellido2
        document.querySelector("[name=apellido2]").setAttribute('readonly', true);
        document.querySelector("[name=categoria]").value = data[0].categoria
        document.querySelector("[name=categoria]").setAttribute('readonly', true);
        document.querySelector("[name=num_cons]").value = data[0].num_cons
        document.querySelector("[name=tot_perc_cheque]").setAttribute('readonly', true);
        document.querySelector("[name=tot_ded_cheque]").setAttribute('readonly', true);
        document.querySelector("[name=tot_net_cheque]").setAttribute('readonly', true);




        cptos2 = []
        data[0].conceptos.forEach(element => {
            pintaElemento(element)
        })
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevoConcepto')).show(); // Returns a Bootstrap modal instance
}

















let cptos2 = []


function pintaElemento(element) {
    let index = addJsonElement({
        percded: element.percded,
        cpto: element.cpto,
        importe: parseFloat(element.importe)
    })
    if (index != -1) {
        let $div = document.createElement("div")
        $div.classList.add("card", "fade", "show")
        $div.innerHTML = templateElemet(`${element.percded}`, `${element.cpto}`, `${element.importe}`, index)
        $div.setAttribute("role", "alert")
        if (element.percded == "P") {
            $div.setAttribute("style", "width: 100%; box-shadow: 0px 0px 7px #7affa4; margin-top: 20px; color: black; border: unset;")
            document.querySelector("[name=divElements]").appendChild($div)
        } else {
            $div.setAttribute("style", "width: 100%;  box-shadow: 0px 0px 7px #ff8aaf;  margin-top: 20px;  color: black; border: unset;")
            document.querySelector("[name=div2Elements]").appendChild($div)

        }
    }


}


function removeElement(event, pd_cpto) {
    let perc = 0
    let ded = 0
    let net = 0
    let paso = cptos2
    cptos2 = []
    let index = paso.findIndex(c => (c.percded == pd_cpto.substring(0, 1) && c.cpto == pd_cpto.substring(1, 3)))
    if (index > -1) {
        paso.splice(index, 1)
        //event.target.parentElement.parentElement.parentElement.parentElement.remove()


        document.querySelector("[name=divElements]").innerHTML = ""
        document.querySelector("[name=div2Elements]").innerHTML = ""

        paso.forEach(e => {
            pintaElemento(e)
            if (e.percded == 'P') {
                perc = perc + parseFloat(e.importe)
            }
            else {
                ded = ded + parseFloat(e.importe)
            }
        })
        net = perc - ded
        /*document.querySelector("[name=tot_perc_cheque]").value = perc.toFixed(2)
        document.querySelector("[name=tot_ded_cheque]").value = ded.toFixed(2)
        document.querySelector("[name=tot_net_cheque]").value = net.toFixed(2)*/

        document.querySelector("[name=tot_perc_cheque]").value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(perc))
        document.querySelector("[name=tot_ded_cheque]").value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(ded))
        document.querySelector("[name=tot_net_cheque]").value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(net))


    }





}


const addJsonElement = json => {
    if ("PD".indexOf(json.percded) > -1) {
        let perc = 0
        let ded = 0
        let net = 0
        const resultado = cptos2.find(c => (c.percded == json.percded && c.cpto == json.cpto))
        if (!resultado) {
            cptos2.push(json)
            //console.log(cptos2)
            cptos2.forEach(e => {
                if (e.percded == 'P') {
                    perc = perc + parseFloat(e.importe)
                }
                else {
                    ded = ded + parseFloat(e.importe)
                }
            })
            net = perc - ded

            /*document.querySelector("[name=tot_perc_cheque]").value = perc.toFixed(2)
            document.querySelector("[name=tot_ded_cheque]").value = ded.toFixed(2)
            document.querySelector("[name=tot_net_cheque]").value = net.toFixed(2)*/
            document.querySelector("[name=tot_perc_cheque]").value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(perc))
            document.querySelector("[name=tot_ded_cheque]").value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(ded))
            document.querySelector("[name=tot_net_cheque]").value = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(parseFloat(net))

            return cptos2.length - 1
        }
        else {
            alert('Error, Ya existe', 'danger')
            return - 1
        }
    }
    else {
        return - 1
    }
}




document.getElementById('modalNuevoConcepto').addEventListener('shown.bs.modal', function () {
    console.log('OPEN MODAL');
})

document.getElementById('modalNuevoConcepto').addEventListener('hidden.bs.modal', function () {
    console.log('CLOSE MODAL');
    modalClearConceptos()
})



document.getElementById("add").addEventListener("click", (event) => {

    const percded = document.querySelector("[name=percded]")
    const cpto = document.querySelector("[name=cpto]")
    const importe = document.querySelector("[name=importe]")
    if (percded.value != "" && cpto.value != "" && importe.value != "") {
        let element = new Object()
        element.percded = percded.value.toUpperCase()
        element.cpto = cpto.value.toUpperCase()
        element.importe = importe.value
        pintaElemento(element)
        percded.value = ""
        cpto.value = ""
        importe.value = ""
    } else (
        alert("complete los conceptos", "danger")
    )
})