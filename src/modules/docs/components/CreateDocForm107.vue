<template>
  <ComponentCard>
    <form class="space-y-6">
      <div class="flex gap-3">
        <DateInput
            v-model="localFormTemp.tripDateStart"
            label="Начало командировки"
            class="w-[50%]"
            :error="errors.tripDateStart"
        />

        <DateInput
            v-model="localFormTemp.tripDateEnd"
            label="Конец командировки"
            class="w-[50%]"
            :error="errors.tripDateEnd"
        />
      </div>

      <SelectInput
          v-model="localFormTemp.fundingSource"
          label="Источник финансирования"
          placeholder="Выберите источник финансирования"
          :options="travelFundingSourcesOptions"
          :error="errors.fundingSource"
      />

      <SelectInput
          v-if="userStore.user?.is_dean"
          v-model="localFormTemp.vice"
          label="Заместитель"
          placeholder="Выберите заместителя"
          :options="vicesOptions"
      />

      <TextArea
          v-model="localFormTemp.tripPurpose"
          description="Цель командировки"
          placeholder="Название мероприятия, название проекта и т. д."
          :error="errors.tripPurpose"
      />
    </form>
  </ComponentCard>

  <ComponentCard v-for="(destination, index) in localFormTemp.destinations" :key="index" class="mt-4">
    <div class="relative">
      <button
          v-if="localFormTemp.destinations.length > 1"
          type="button"
          class="absolute -top-5 -right-5 inline-flex items-center justify-center rounded-2xl p-2 bg-error-500/55 text-white hover:bg-error-500/50 dark:bg-error-500/15 dark:text-error-500 dark:hover:bg-error-500/30"
          title="Удалить"
          @click="removeDestination(index)"
      >
        <TrashIcon/>
      </button>
    </div>

    <BaseInput
        v-model="destination.full_address"
        label="Страна, населенный пункт, полный адрес"
        placeholder="Введите полный адрес назначения"
        :error="errors.destinations?.[index]?.full_address"
    />

    <BaseInput
        v-model="destination.organization"
        label="Организация назначения"
        placeholder="Введите название организации назначения"
        :error="errors.destinations?.[index]?.organization"
    />

    <div class="flex gap-3">
      <DateInput
          v-model="destination.date_start"
          label="Дата начала мероприятия"
          class="w-[50%]"
      />

      <DateInput
          v-model="destination.date_end"
          label="Дата завершения мероприятия"
          class="w-[50%]"
      />
    </div>
  </ComponentCard>

  <div class="flex justify-center mt-5 w-full">
    <BaseButton variant="outline" @click.prevent="addDestination">
      Добавить пункт поездки
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, reactive, defineExpose, defineProps, defineEmits, toRef} from "vue";
import SelectInput from "@/components/ui/SelectInput.vue";
import TextArea from "@/components/ui/TextArea.vue";
import DateInput from "@/components/ui/DateInput.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import TrashIcon from "@/components/icons/TrashIcon.vue";
import { useUserStore } from "@/stores/userStore";
import { loadTravelFundingSourcesOptions } from "@/modules/docs/composables/travelFundingSource";
import { loadViceOptions } from "@/modules/docs/composables/vices";
import {documentAutoCreatePDF, tempDocumentPdf} from "@/modules/docs/api/docs.api";
import { CreateDocForm107, CreateDocForm } from "@/modules/docs/types/form";
import type { MultiSelectOption } from "@/components/ui/MultiSelectInput.vue";


const props = defineProps<{
  modelValue: CreateDocForm
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: CreateDocForm): void
}>()

const localFormTemp = reactive<CreateDocForm107>({
  tripDateStart: '',
  tripDateEnd: '',
  fundingSource: null as unknown as number,
  vice: '',
  tripPurpose: '',
  destinations: []
});

const localForm = toRef(props, 'modelValue')

const errors = reactive<any>({});

const userStore = useUserStore();
const travelFundingSourcesOptions = ref<MultiSelectOption[]>([]);
const vicesOptions = ref<MultiSelectOption[]>([]);

const addDestination = () => {
  localFormTemp.destinations.push({
    full_address: '',
    organization: '',
    date_start: '',
    date_end: ''
  });
};

const removeDestination = (index: number) => {
  localFormTemp.destinations.splice(index, 1);
};

onMounted(async () => {
  travelFundingSourcesOptions.value = await loadTravelFundingSourcesOptions('ru');

  if (userStore.user?.is_dean) {
    vicesOptions.value = await loadViceOptions(userStore.user?.structural_subdivision.id);
  }

  if (!localFormTemp.destinations.length) {
    addDestination();
  }
});

// Валидация
const validate = (): boolean => {
  let isValid = true;
  // Сброс ошибок
  Object.keys(errors).forEach(key => delete errors[key]);

  if (!localFormTemp.tripDateStart) { errors.tripDateStart = true; isValid = false; }
  if (!localFormTemp.tripDateEnd) { errors.tripDateEnd = true; isValid = false; }
  if (!localFormTemp.fundingSource) { errors.fundingSource = true; isValid = false; }
  if (!localFormTemp.tripPurpose) { errors.tripPurpose = true; isValid = false; }

  // Валидация назначений (пример)
  localFormTemp.destinations.forEach((dest, index) => {
    if (!dest.full_address) {
      if (!errors.destinations) errors.destinations = {};
      if (!errors.destinations[index]) errors.destinations[index] = {};
      errors.destinations[index].full_address = true;
      isValid = false;
    }
  });

  return isValid;
};

// Метод, который вызовет родитель
const submit = async (): Promise<{ file: File, documentName: string } | null> => {
  if (!validate()) return null;

  const templateData = {
    tripPurpose: localFormTemp.tripPurpose,
    tripDateStart: localFormTemp.tripDateStart,
    tripDateEnd: localFormTemp.tripDateEnd,
    fundingSource: localFormTemp.fundingSource,
    vice_id: localFormTemp.vice || '',
    destinations: localFormTemp.destinations.map(d => ({
      full_address: d.full_address,
      organization: d.organization,
      date_start: d.date_start,
      date_end: d.date_end
    }))
  };

  try {
    const response = await documentAutoCreatePDF(107, 'kz', templateData );
    const pdf_response = await tempDocumentPdf(response.data.document_temp_id);

    const blob = new Blob([pdf_response.data], { type: 'application/pdf' });
    const file = new File([blob], "Заявление на командировку.pdf", { type: "application/pdf" });

    localForm.value.documentName = 'Заявление на командировку';
    localForm.value.recipientId = response.data.recipient_id
    localForm.value.file = file;

    localForm.value.approversSelectedOptions =
        response.data.approver_ids.map(id => ({
          value: id,
          label: String(id),
        }))

    return {
      file,
      documentName: `Командировка ${localFormTemp.tripDateStart} - ${localFormTemp.tripDateEnd}`
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

defineExpose({
  submit
});
</script>