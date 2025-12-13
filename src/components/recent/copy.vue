<template>
  <Dialog v-model:visible="visible" modal header="链接" :style="{ width: '25rem' }">
    <div class="flex items-center gap-4 mb-4">
      <InputGroup>
        <InputText id="url" class="flex-auto" autocomplete="off" size="small" v-model="url" />
        <Button size="small" icon="pi pi-clipboard" @click="copyLink(url)" />
      </InputGroup>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <InputGroup>
        <InputText id="magnet" class="flex-auto" autocomplete="off" size="small" v-model="magnet" />
        <Button size="small" icon="pi pi-clipboard" @click="copyLink(magnet)" />
      </InputGroup>
    </div>
  </Dialog>
</template>

<script lang="ts" setup >

import { Dialog, InputText, Button, InputGroup } from 'primevue';

import { ref } from 'vue';
import recent from '../../store/recent';

const visible=ref(false);

const url=ref('');
const magnet=ref('');

defineExpose({
  visible,
  url,
  magnet
})


const copyLink=(url: string)=>{
  recent().copy(url);
}
</script>