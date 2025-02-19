import { create } from "zustand";
import { persist } from "zustand/middleware";
import dayjs, { Dayjs } from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";

export interface Entry {
    id: number;
    date: Dayjs;
    startTime: Dayjs;
    endTime: Dayjs;
    lunch: string;
    workWith: string;
    jobDescription: string;
    totalHours: string;
}

export interface Store {
    name: string;
    entries: Entry[];
    form: Entry;
    open: boolean;
    isEditing: boolean;
    setOpen: (open: boolean) => void;
    setEditing: (isEditing: boolean) => void;
    setForm: (form?: Partial<Entry>) => void;
    addEntry: () => void;
    exportPDF: () => void;
    deleteEntry: (id: number) => void;
    setName: (value: string) => void;
    defaultForm: Entry;
}

const defaultForm: Entry = {
    id: 0,
    date: dayjs(), // Dayjs-об'єкт
    startTime: dayjs().hour(7).minute(0).second(0).millisecond(0),
    endTime: dayjs(),
    lunch: "1",
    workWith: "",
    jobDescription: "",
    totalHours: "",
};

const useStore = create<Store>()(
    persist(
        (set, get) => ({
            name: "",
            entries: [],
            defaultForm,
            isEditing: false,
            open: false,
            form: defaultForm,
            setName: (value: string) => set({ name: value }),
            setEditing: (isEditing: boolean) => set({ isEditing }),
            setOpen: (open: boolean) => set({ open }),
            setForm: (form?: Partial<Entry>) =>
                set((state) => ({ form: { ...state.form, ...form } })),
            addEntry: () =>
                set((state) => {
                    const start = dayjs(state.form.startTime);
                    const end = dayjs(state.form.endTime);
                    // Calculate the difference in minutes between end and start
                    const diffMinutes = end.diff(start, "minute");
                    // Convert lunch break (in hours) to minutes
                    const lunchMinutes = parseFloat(state.form.lunch) * 60;
                    // Total worked minutes after subtracting lunch break
                    // const totalMinutes = diffMinutes ;
                    // Calculate the decimal total hours for storage (rounded to 2 decimals)
                    // const totalHoursDecimal = parseFloat((totalMinutes / 60).toFixed(2));
                    const hours = Math.floor(diffMinutes / 60);
                    const minutes = diffMinutes % 60;
                    const totalHoursFormatted = `${hours}h ${minutes}m`;
                    if (state.isEditing) {
                        // Update existing entry
                        return {
                            entries: state.entries.map((entry) =>
                                entry.id === state.form.id
                                    ? { ...state.form, totalHours: totalHoursFormatted }
                                    : entry
                            ),
                            form: state.defaultForm,
                            open: false,
                            isEditing: false,
                        };
                    } else {
                        // Create new entry
                        return {
                            entries: [
                                ...state.entries,
                                {
                                    ...state.form,
                                    totalHours: totalHoursFormatted,
                                    id: state.entries.length ? Math.max(...state.entries.map(e => e.id)) + 1 : 1,
                                },
                            ],
                            form: state.defaultForm,
                            open: false,
                        };
                    }
                }),
            deleteEntry: (id: number) =>
                set((state) => ({
                    entries: state.entries.filter((entry) => entry.id !== id),
                })),
            exportPDF: () => {
                const { name, entries } = get();
                const doc = new jsPDF("p", "mm", "a4");
                const pageWidth = doc.internal.pageSize.getWidth();
                doc.setFontSize(18);
                doc.text(`${name} Time Card Report`, pageWidth / 2, 15, {
                    align: "center",
                });
                const tableColumn = [
                    "#",
                    "Date",
                    "Start Time",
                    "End Time",
                    "Lunch",
                    "Work With",
                    "Job Description",
                    "Total Hours",
                ];
                const tableRows = entries.map((entry, index) => {
                    const dateString = dayjs(entry.date).format("YYYY-MM-DD");
                    const startString = dayjs(entry.startTime).format("HH:mm");
                    const endString = dayjs(entry.endTime).format("HH:mm");

                    return [
                        index + 1,
                        dateString,
                        startString,
                        endString,
                        entry.lunch,
                        entry.workWith,
                        entry.jobDescription,
                        entry.totalHours,
                    ];
                });
                (doc as any).autoTable({
                    head: [tableColumn],
                    body: tableRows,
                    startY: 25,
                    // Використовуємо всю ширину сторінки, але не виходимо за межі
                    tableWidth: "auto",
                    // Загальні стилі для всієї таблиці
                    styles: {
                        fontSize: 10,
                        // Якщо текст не вміщається по ширині — переносимо його
                        overflow: "linebreak",
                    },
                    // Індивідуальні стилі для колонок
                    columnStyles: {
                        // Припустимо, індекси колонок збігаються з порядком у tableColumn
                        // 0: # (порядковий номер)
                        0: { cellWidth: 10 },
                        // 1: Date
                        1: { cellWidth: 24 },
                        // 2: Start Time
                        2: { cellWidth: 18 },
                        // 3: End Time
                        3: { cellWidth: 18 },
                        // 4: Lunch (h)
                        4: { cellWidth: 15 },
                        // 5: Work With
                        5: { cellWidth: 30 },
                        // 6: Job Description (довгі тексти)
                        //   Задаємо більшу ширину, щоб текст мав де розміститися.
                        //   Якщо текст дуже довгий, він буде переноситися на нові рядки.
                        6: { cellWidth: 60 },
                        // 7: Total Hours
                        7: { cellWidth: 20 },
                    },
                    margin: { left: 10, right: 10 }, // Відступи зліва і справа
                    theme: "grid",
                    headStyles: { fillColor: [22, 160, 133] },
                });

                const pageCount = doc.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.text(
                        `Page ${i} of ${pageCount}`,
                        pageWidth - 20,
                        doc.internal.pageSize.getHeight() - 10
                    );
                }
                doc.save("timecard_report.pdf");
            },
        }),
        {
            name: "timecard-store", // unique name for localStorage key
            // // Optionally, you can add a custom serializer/deserializer
            // serialize: (state) => JSON.stringify(state),
            // deserialize: (str) => JSON.parse(str),
        }
    )
);

export default useStore;
