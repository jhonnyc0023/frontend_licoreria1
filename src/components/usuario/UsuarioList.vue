<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-..." crossorigin="anonymous" />
<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue"
import http from '@/plugins/axios'
import type { Cliente } from "@/models/cliente";

const props = defineProps<{
  ENDPOINT_API: string
}>()
const ENDPOINT = props.ENDPOINT_API ?? ''
var usuarios = ref<Usuario[]>([])

async function getUsuarios() {
  usuarios.value = await http.get(ENDPOINT).then((response) => response.data)
}

function toEdit(id: number) {
  router.push(`/usuarios/editar/${id}`)
}
function formatFecha(fecha: string | number | Date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha).toLocaleDateString(undefined, options);
}

async function toDelete(id: number) {
  var r = confirm('¿Está seguro que se desea eliminar el usuario?')
  if (r == true) {
    await http.delete(`${ENDPOINT}/${id}`).then(() => getClientes())
  }
}

onMounted(() => {
  getUsuarios()
})
</script>

<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink to="/">Inicio</RouterLink>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Usuarios</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-12 text-center mt-3 mb-3"></div>
      <h2>Lista de Usuarios</h2>
      <div class="col-12">
        <RouterLink to="/usuarios/crear">
          <font-awesome-icon icon="fa-solid fa-plus" />CREAR NUEVO
          <div class="col-12 text-center mt-3 mb-3"></div>
          <div class="col-12 text-center mt-3 mb-3"></div>
        </RouterLink>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Usuario</th>
            <th scope="col">Email</th>
            <th scope="col">Rol</th>
            <th scope="col">fecha de creacion</th>
            <th scope="col">fecha de modificación</th>
            <th scope="col">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
            <td scope="row">{{ index + 1 }}</td>
            <td>{{ usuario.usuario }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.rol }}</td>
            <td>{{ formatFecha(usuario.fechaCreacion) }}</td>
            <td>{{ formatFecha(usuario.fechaModificacion) }}</td>
            <td>
              <button class="btn text-success" @click="toEdit(usuario.id)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn text-danger" @click="toDelete(usuario.id)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table {
  background-color: rgba(22, 165, 129, 0.055)}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #631a1a;
}

.btn {
  margin-right: 5px;
}
</style>
