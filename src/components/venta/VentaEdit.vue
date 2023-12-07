<script setup lang="ts">
import { onMounted, ref } from 'vue'
import http from '@/plugins/axios'
import router from '@/router'
import type { Cliente } from '@/models/cliente';

var clientes = ref<Clisente[]>([])
async function getClientes() {
  clientes.value = await http.get('clientes').then((response) => response.data)
}
onMounted(() => {
  getClientes()
})

const props = defineProps<{
  ENDPOINT_API: string
}>()

const ENDPOINT = props.ENDPOINT_API ?? ''

const fechaVenta = ref('')
const idCliente = ref('')
const id = router.currentRoute.value.params['id']

async function editarVenta() {
  await http
    .patch(`${ENDPOINT}/${id}`, {
      fechaVenta: fechaVenta.value,
      idCliente: idCliente.value
    })
    .then(() => router.push('/ventas'))
    .catch((error) => {

      console.error('Error al editar la venta:', error)
    })
}

async function getVenta() {
  await http.get(`${ENDPOINT}/${id}`).then((response) => {
    ; (fechaVenta.value = response.data.fechaVenta),
      (idCliente.value = response.data.cliente.id)
  })
}

function goBack() {
  router.go(-1)
}

onMounted(() => {
  getVenta()
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
          <RouterLink to="/clientes">Ventas</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Editar</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-12 text-center mt-3 mb-3"></div>
      <h2>Editar Venta</h2>
    </div>

    <div class="row">
      <form @submit.prevent="editarVenta">
        <div class="form-floating">
          <input type="date" class="form-control" v-model="fechaVenta" placeholder="FechaVenta" required />
          <label for="fechaVenta">Fecha de Venta</label>
        </div>
        <div class="form-floating mb-3">
          <select v-model="idCliente" class="form-select">
            <option v-for="cliente in clientes" :value="cliente.id" :key="cliente.id">{{ cliente.nombre+' '+cliente.apellido }}
            </option>
          </select>
          <label for="cliente">Cliente</label>
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
