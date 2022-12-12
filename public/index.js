

socket = io();
const productoHtml = (prod)=>{
    const newRow = document.createElement("tr")
    newRow.innerHTML=`<td class="text-light">${prod.title}</td>
                        <td class="text-light">${prod.price}</td>
                        <td>
                            <img src="${prod.thumbnail}" alt="${prod.title}" width="80px" />
                         </td>`
    document.querySelector(".tablaProductos").appendChild(newRow)
}

const listProdcuts = (arrayProductos) => {
    const listaProductos = document.querySelector(".listaProductos");

    const h3mensaje = document.createElement("h3")
         h3mensaje.innerHTML = "no hay productos"
         h3mensaje.className = "text-light text-center notProducts"
         
         h3mensaje.className = "text-light text-center notProducts"
         if(arrayProductos.length > 0){
            const divContainer = document.createElement("div")
                divContainer.className = "d-flex flex-column align-items-center divProdListContainer"
                h3mensaje.remove()
                divContainer.innerHTML = `
                    <div class="col-8">
                        <table class="table table-dark tablaProductos">
                            <tr class="table-active">
                                <th scope="col">Nombre</th>
                                <th scope="col">Precio</th>
                                <th scope="col">link img</th>
                            </tr>
                        </table>
                    </div>`
                listaProductos.appendChild(divContainer)
                arrayProductos.forEach((prod)=>{
                    productoHtml(prod)
                })
    }
    else{
        listaProductos.appendChild(h3mensaje)
    }
};


const addProduct=(ev)=>{
    const newProd = {
        title : document.querySelector("#title").value,
        price: document.querySelector("#price").value,
        thumbnail: document.querySelector("#thumbnail").value
    }
    socket.emit("nuevoProducto", newProd)
}

socket.on("actualizacionPrd", producto=>{
    productoHtml(producto)
})

socket.on("canalProductos", productos=>{
    listProdcuts(productos)
})
//apartado de chat



const render = (data)=>{
    const element = data.map((user, index)=>{
        return(`<div>
                    <b class="text-primary">${user.email}</b><span style="color:#9D5100;">[${user.time}]:<span>
                    <i class="text-success">${user.mensaje}</i>
             </div>`)}
        )
        document.querySelector("#mensajes").innerHTML=element
}
const rndrOneMessage = (mensaje)=>{
    const messageContainer = document.createElement("div")
    messageContainer.innerHTML = `<b class="text-primary">${mensaje.email}</b><span style="color:#9D5100;">[${mensaje.time}]:<span>
    <i class="text-success">${mensaje.mensaje}</i>`
    document.querySelector("#mensajes").appendChild(messageContainer)
}

const addMessage = (ev)=>{
    const correo = document.querySelector("#email")
    if(correo.value.length===0){
        correo.placeholder = "por favor ingrese correo"
    }
    else{
        socket.emit("nuevoMensaje", {
            email: correo.value,
            mensaje: document.querySelector("#mensaje").value
        })
    }
    return false
}

socket.on("mensajes", mensajes=>{
    render(mensajes)
})

socket.on("nuevoMensajeAtodos", mensaje=>{
        rndrOneMessage(mensaje)
})