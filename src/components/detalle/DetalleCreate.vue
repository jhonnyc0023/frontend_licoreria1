<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import http from '@/plugins/axios'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

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

function mostrarTotalVenta() {
    const sumaTotalVenta = detallesVenta.value.reduce((total, detalle) => total + detalle.totalVenta, 0)
    alert(`La suma total de las ventas es: ${sumaTotalVenta}`)
}


const ENDPOINT = props.ENDPOINT_API ?? ''
const detallesVenta = ref<Array<{ cantidad: number, precioUnitario: number, totalVenta: number, idCliente: string, idProducto: string }>>([]) // Especificamos el tipo de detallesVenta

const router = useRouter()

function agregarDetalle() {
    detallesVenta.value.push({
        cantidad: 0, // Inicializamos cantidad como un número
        precioUnitario: 0, // Inicializamos precioUnitario como un número
        totalVenta: 0, // Inicializamos totalVenta como un número
        idCliente: '',
        idProducto: ''
    })
}


watch(detallesVenta, (detalles) => {
    detalles.forEach((detalle) => {
        detalle.totalVenta = detalle.cantidad * detalle.precioUnitario // El resultado será un número
    })
}, { deep: true })


async function crearDetalles() {
    try {
        await Promise.all(detallesVenta.value.map(async (detalle) => {
            await http.post(ENDPOINT, detalle)
        }))
        router.push('/detalles')
    } catch (error) {
        console.error('Error al crear los detalles de venta:', error)
    }
}

function goBack() {
    router.go(-1)
}
</script>

<template>
    <div class="container">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/">Inicio</router-link>
                </li>
                <li class="breadcrumb-item">
                    <router-link to="/detalles"> Venta</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Crear</li>
            </ol>
        </nav>
        <div class="row">
            <div class="col-12 text-center mt-3 mb-3"></div>
            <h2>Crear Nueva Venta</h2>
        </div>

        <div class="row">
            <form @submit.prevent="crearDetalles">
                <div v-for="(detalle, index) in detallesVenta" :key="index" class="row align-items-center">
                    <div class="col">
                        <div class="form-floating mb-3">
                            <select v-model="detalle.idProducto" class="form-select">
                                <option v-for="producto in productos" :value="producto.id" :key="producto.id">{{
                                    producto.nombre }}</option>
                            </select>
                            <label for="producto">Producto</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" v-model="detalle.cantidad" placeholder="Cantidad"
                                required />
                            <label for="cantidad">Cantidad</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" v-model="detalle.precioUnitario"
                                placeholder="PrecioUnitario" required />
                            <label for="precioUnitario">Precio por Unidad</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control" v-model="detalle.totalVenta"
                                placeholder="PrecioUnitario" required />
                            <label for="total venta">total de venta</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3">
                            <select v-model="detalle.idCliente" class="form-select">
                                <option v-for="cliente in clientes" :value="cliente.id" :key="cliente.id">{{ cliente.nombre+' '+cliente.apellido }}
                                </option>
                            </select>
                            <label for="cliente"> Cliente</label>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-3">
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group me-2" role="group" aria-label="First group">
                            <button type="button" class="btn btn-primary btn-lg" @click="agregarDetalle">Agregar
                                Venta</button>
                        </div>
                        <div class="btn-group" role="group" aria-label="Second group">
                            <button type="submit" class="btn btn-primary btn-lg">Crear Venta</button>
                        </div>
                    </div>
                    <!-- Agrega este botón en tu template -->
                    <button class="btn btn-primary btn-lg" @click.prevent="mostrarTotalVenta"> Total a Pagar</button>

                </div>
            </form>
        </div>
        <div class="text-left">
            <button class="btn btn-link" @click="goBack">Volver</button>
        </div>
    </div>
</template>


<style></style>
