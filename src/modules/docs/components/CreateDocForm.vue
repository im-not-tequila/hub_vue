<template>
  <form class="space-y-6">
    <BaseInput
        v-model="localForm.documentName"
        label="Название документа"
        placeholder="Введите название документа"
        :is_error="localForm.errors?.documentName"
        @change="localForm.errors.documentName = false"
        required
    />

    <SelectInput
        v-model="localForm.recipientId"
        :options="tutorsWithPositionOptions"
        label="Кому:"
        placeholder="Выберите кому отправить"
        :is_error="localForm.errors?.recipientId"
        @change="localForm.errors.recipientId = false"
        required

    />

    <MultiSelectInput
        v-model="localForm.approversSelectedOptions"
        :options="tutorsWithPositionOptions"
        label="Согласующие:"
        placeholder="Выберите согласующих"
        clearable
    />

    <Dropzone
        @update:file="localForm.file = $event"
        acceptedFiles="application/pdf, image/jpeg"
        placeholder="Перетащите сюда PDF или JPG файл"
    />
  </form>
</template>

<script setup lang="ts">

import BaseInput from "@/components/ui/BaseInput.vue";
import SelectInput from "@/components/ui/SelectInput.vue";
import Dropzone from "@/components/ui/Dropzone.vue";
import MultiSelectInput from "@/components/ui/MultiSelectInput.vue";
import {defineEmits, defineProps, onMounted, reactive, ref, toRef} from "vue";
import {CreateDocForm} from "@/modules/docs/types/form";
import type { MultiSelectOption }  from "@/components/ui/MultiSelectInput.vue";
import {loadTutorsWithPositionOptions} from "@/modules/docs/composables/tutorsWithPosition";


const props = defineProps<{
  modelValue: CreateDocForm
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: CreateDocForm): void
}>()

const tutorsWithPositionOptions = ref<MultiSelectOption[]>([])

const localForm = toRef(props, 'modelValue')

onMounted(async () => {
  tutorsWithPositionOptions.value = await loadTutorsWithPositionOptions()
})

</script>
