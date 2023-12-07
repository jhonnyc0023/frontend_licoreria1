
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { RouterLink } from 'vue-router';
import router from '@/router'
import type { Producto } from '@/models/producto';
import type { Cliente } from '@/models/cliente';

var clientes = ref<Cliente[]>([])
async function getClientes() {
    clientes.value = await http.get('clientes').then((response) => response.data)
}
onMounted(() => {
    getClientes()
})

var productos = ref<Producto[]>([])
async function getProductos() {
    productos.value = await http.get('productos').then((response) => response.data)
}
onMounted(() => {
    getProductos()
})

const props = defineProps<{
    ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''
const cantidad = ref('')
const precioUnitario = ref('')
const totalVenta = ref('')
const idCliente = ref('')
const idProducto = ref('')
const id = router.currentRoute.value.params['id']

async function editarDetalle() {
    await http
        .patch(`${ENDPOINT}/${id}`, {
            cantidad: cantidad.value,
            precioUnitario: precioUnitario.value,
            totalVenta: totalVenta.value,
            idCliente: idCliente.value,
            idProducto: idProducto.value
        })
        .then(() => router.push('/detalles'))
        .catch((error) => {

            console.error('Error al editar el detalle de venta:', error)
        })
}

async function getDetalle() {
    await http.get(`${ENDPOINT}/${id}`).then((response) => {
         (cantidad.value = response.data.cantidad), 
        (precioUnitario.value = response.data.precioUnitario),
        (totalVenta.value = response.data.totalVenta), 
        (idCliente.value = response.data.cliente.id), 
        (idProducto.value = response.data.producto.id)
    })
}

function goBack() {
    router.go(-1)
}

onMounted(() => {
    getDetalle()
})
</script>

<template>
    <div class="container">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <RouterLink to="/">Inicio</RouterLink>
                </li>
                <li class="breadcrumb-item">
                    <RouterLink to="/detalles">Lista de Ventas</RouterLink>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Editar</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-12 text-center mt-3 mb-3"></div>
            <h2>Editar  Venta</h2>
        </div>

        <div class="row">
            <form @submit.prevent="editarDetalle">
                <div class="form-floating mb-3">
                    <select v-model="idProducto" class="form-select">
                        <option v-for="producto in productos" :value="producto.id" :key="producto.id">{{ producto.nombre }}
                        </option>
                    </select>
                    <label for="producto">Producto</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" v-model="cantidad" placeholder="Cantidad" required />
                    <label for="cantidad">Cantidad</label>
                </div>
                <div class="form-floating">
                    <input type="text" class="form-control" v-model="precioUnitario" placeholder="PrecioUnitario"
                        required />
                    <label for="precioUnitario">PrecioUnitario</label>
                </div>
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" v-model="totalVenta" placeholder="TotalVenta" required />
                    <label for="totalVenta">Total de Venta</label>
                </div>
                <div class="form-floating mb-3">
                    <select v-model="idCliente" class="form-select">
                        <option v-for="Cliente in clientes" :value="Cliente.id" :key="Cliente.id">{{ Cliente.nombre+' '+Cliente.apellido}}
                        </option>
                    </select>
                    <label for="nombre de cliente">Nombre de Cliente</label>
                </div>
                <div class="text-center mt-3">
                    <button type="submit" class="btn btn-primary btn-lg">
                        <font-awesome-icon icon="fa-solid fa-floppy-disk" /> Guardar
                    </button>
                </div>
            </form>
        </div>
        <div class="text-left">
            <button class="btn btn-link" @click="goBack">Volver</button>
        </div>
    </div>
</template>

<style></style>
