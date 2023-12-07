<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import type { Venta } from '@/models/venta';
import type { Producto } from '@/models/producto';


var ventas = ref<Venta[]>([])
async function getVentas() {
    ventas.value = await http.get('ventas').then((response) => response.data)
}
onMounted(() => {
    getVentas()
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
const detallesVenta = ref<Array<{ cantidad: string, precioUnitario: string, idVenta: string, idProducto: string }>>([]) // Especificamos el tipo de detallesVenta

const router = useRouter()

function agregarDetalle() {
    detallesVenta.value.push({
        cantidad: '',
        precioUnitario: '',
        idVenta: '',
        idProducto: ''
    })
}

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
                    <router-link to="/detalles">Detalles de Venta</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Crear</li>
            </ol>
        </nav>

        <div class="row">
            <form @submit.prevent="crearDetalles">
                <div v-for="(detalle, index) in detallesVenta" :key="index">
                    <div class="form-floating mb-3">
                        <select v-model="detalle.idProducto" class="form-select">
                            <option v-for="producto in productos" :value="producto.id" :key="producto.id">{{ producto.nombre }}</option>
                        </select>
                        <label for="producto">Producto</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" v-model="detalle.cantidad" placeholder="Cantidad" required />
                        <label for="cantidad">Cantidad</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="number" class="form-control" v-model="detalle.precioUnitario" placeholder="PrecioUnitario" required />
                        <label for="precioUnitario">Precio por Unidad</label>
                    </div>
                    <div class="form-floating mb-3">
                        <select v-model="detalle.idVenta" class="form-select">
                            <option v-for="venta in ventas" :value="venta.id" :key="venta.id">{{ venta.totalVenta }}</option>
                        </select>
                        <label for="venta total">Venta Total</label>
                    </div>
                </div>
                <div class="text-center mt-3">
                    <button type="button" class="btn btn-primary btn-lg" @click="agregarDetalle">Agregar Detalle</button>
                    <button type="submit" class="btn btn-primary btn-lg">Crear Detalles</button>
                </div>
            </form>
        </div>
        <div class="text-left">
            <button class="btn btn-link" @click="goBack">Volver</button>
        </div>
    </div>
</template>

<style></style>
