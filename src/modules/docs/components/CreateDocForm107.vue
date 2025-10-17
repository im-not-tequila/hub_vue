<template>
  <form class="space-y-6">
    <DateInput
        :modelValue="localForm.tripDateStart"
        label="Начало командировки"
    />

    <DateInput
        :modelValue="localForm.tripDateEnd"
        label="Конец командировки"
    />

    <SelectInput
        v-model="localForm.fundingSource"
        label="Источник финансирования"
        placeholder="Выберите источник финансирования"
        :options="[]"
    />

    <TextArea
        v-model="localForm.tripPurpose"
        description="Цель командировки"
        placeholder="Название мероприятия, название проекта и т. д."
    />
  </form>
</template>

<script setup lang="ts">

import SelectInput from "@/components/ui/SelectInput.vue";
import {defineProps, onMounted, ref, toRef} from "vue";
import {CreateDocForm107} from "@/modules/docs/types/form";
import type { MultiSelectOption }  from "@/components/ui/MultiSelectInput.vue";
import {loadTutorsWithPositionOptions} from "@/modules/docs/composables/tutorsWithPosition";
import TextArea from "@/components/ui/TextArea.vue";
import DateInput from "@/components/ui/DateInput.vue";


const props = defineProps<{
  modelValue: CreateDocForm107
}>()

const tutorsWithPositionOptions = ref<MultiSelectOption[]>([])

const localForm = toRef(props, 'modelValue')

onMounted(async () => {
  tutorsWithPositionOptions.value = await loadTutorsWithPositionOptions()
})

</script>
