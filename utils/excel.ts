import * as XLSX from 'xlsx';
import { db } from '../lib/db';
import { Cliente, Nota } from '../types';

export const exportData = async () => {
    try {
        const clientes = await db.clientes.toArray();
        const notas = await db.notas.toArray();

        // Create workbook
        const wb = XLSX.utils.book_new();

        // Add Clientes sheet
        const wsClientes = XLSX.utils.json_to_sheet(clientes);
        XLSX.utils.book_append_sheet(wb, wsClientes, "Clientes");

        // Add Notas sheet
        const wsNotas = XLSX.utils.json_to_sheet(notas);
        XLSX.utils.book_append_sheet(wb, wsNotas, "Notas");

        // Save
        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `CRM_Backup_${date}.xlsx`);
    } catch (error) {
        console.error("Error exporting data:", error);
        alert("Error al exportar datos.");
    }
};

export const importData = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                // Check sheets
                if (!workbook.SheetNames.includes("Clientes") || !workbook.SheetNames.includes("Notas")) {
                    alert("El archivo no tiene el formato correcto (hojas Clientes y Notas requeridas).");
                    reject(new Error("Invalid format"));
                    return;
                }

                // Parse data
                const clientesRaw = XLSX.utils.sheet_to_json(workbook.Sheets["Clientes"]);
                const notasRaw = XLSX.utils.sheet_to_json(workbook.Sheets["Notas"]);

                // Transaction to replace data safely
                await db.transaction('rw', db.clientes, db.notas, async () => {
                    // Clear existing data? Or merge?
                    // "Restore" implies replacing or at least ensuring consistency.
                    // To avoid duplicates if IDs collide, we might want to clear or use put.
                    // The prompt says "Prevención de duplicados". 
                    // Using `put` (upsert) based on ID is safe.
                    // However, if we clear everything first it's a full restore.
                    // Let's ask user? No, simpler: Upsert everything.
                    
                    // Actually, let's clear to ensure full state restore if intended as a backup restore.
                    // But if it's "Import", maybe just add new ones?
                    // Prompt says: "Importar datos... Prevención de duplicados... Proceso seguro de restauración".
                    // "Restauración" implies recovering a state.
                    // Let's clear and add.
                    
                    await db.clientes.clear();
                    await db.notas.clear();

                    await db.clientes.bulkAdd(clientesRaw as Cliente[]);
                    await db.notas.bulkAdd(notasRaw as Nota[]);
                });

                alert("Datos importados exitosamente.");
                resolve();
                // Force reload to update UI
                window.location.reload();
            } catch (error) {
                console.error("Error importing data:", error);
                alert("Error al procesar el archivo.");
                reject(error);
            }
        };

        reader.readAsArrayBuffer(file);
    });
};
