import httpClient from "@/api/httpClient";
import {Tabel} from "@/modules/work-tabel/types/tabel";
import { saveAs } from 'file-saver';


export const workTabel = (year: number, month: number) =>
    httpClient.get<Tabel[]>(`/work-tabel`, {
        params: {
            year,
            month,
        }
    })


export const workTabelExcel = async (year: number, month: number) => {
    try {
        // Указываем responseType: 'blob' для получения бинарных данных
        const response = await httpClient.get(
            `/work-tabel/excel`,
            {
                params: {
                    year,
                    month,
                },
                responseType: 'blob', // !!! Ключевое изменение
            }
        );

        // Получаем имя файла из заголовков ответа
        // Backend отправляет Content-Disposition, который содержит имя файла
        const contentDisposition = response.headers['content-disposition'];
        let filename = `табель_учета_времени_${year}_${month}.xlsx`; // Имя файла по умолчанию

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-8'')?([^;"]+)/i);
            if (filenameMatch && filenameMatch[1]) {
                // Декодируем имя файла, если оно было закодировано
                try {
                    filename = decodeURIComponent(filenameMatch[1]);
                } catch (e) {
                    console.warn("Failed to decode filename from Content-Disposition, using raw value.", e);
                    filename = filenameMatch[1];
                }
            }
        }

        // Используем библиотеку file-saver для скачивания файла
        // response.data уже является Blob благодаря responseType: 'blob'
        saveAs(response.data, filename);

    } catch (error) {
        console.error("Ошибка при скачивании файла Excel:", error);
        // Обработка ошибок, например, вывод сообщения пользователю
    }
};
