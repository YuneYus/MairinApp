

// utils/medicalPdf.ts

import { MedicalInfo } from "@/storage/medicalInfoStorage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

function row(label: string, value: string) {
  return `
    <tr>
      <td class="label">${label}</td>
      <td class="value">${value || "-"}</td>
    </tr>
  `;
}

function listOrDash(items: string[]) {
  return items.length ? items.join(", ") : "-";
}

function section(title: string, rowsHtml: string) {
  return `
    <h2>${title}</h2>
    <table>${rowsHtml}</table>
  `;
}

export function buildMedicalHtml(info: MedicalInfo, upToPart: number): string {
  let body = "";

  if (upToPart >= 1) {
    body += section(
      "Mis Datos Personales",
      row("Nombre y Apellido", info.fullName) +
        row("Fecha de nacimiento", info.birthDate) +
        row("Altura", info.height) +
        row("Peso", info.weight) +
        row("Tipo de sangre", info.bloodType) +
        row("Ocupación", info.occupation) +
        row("Ciudad de residencia", info.city) +
        row("Teléfono", info.phone) +
        row("Seguro médico", info.insurance) +
        row("Correo electrónico", info.email)
    );

    body += section(
      "Contacto De Emergencia",
      row("Nombre y Apellido", info.emergencyName) +
        row("Teléfono", info.emergencyPhone)
    );
  }

  if (upToPart >= 2) {
    body += section(
      "Enfermedades Actuales O Previas",
      row("Enfermedades diagnosticadas", info.currentIllnesses)
    );

    const surgeriesRows = info.surgeries
      .map(
        (s, i) =>
          row(`Cirugía ${i + 1} - Razón`, s.reason) +
          row(`Cirugía ${i + 1} - Fecha`, s.date)
      )
      .join("");

    body += section(
      "Cirugías Previas",
      surgeriesRows || row("Cirugías", "Ninguna registrada")
    );
  }

  if (upToPart >= 3) {
    body += section(
      "Salud De La Mujer",
      row("Edad de primera menstruación", info.firstPeriodAge) +
        row("Duración del ciclo", info.cycleDuration) +
        row("Duración del sangrado", info.bleedingDuration) +
        row("Nivel de dolor menstrual", info.painLevel) +
        row("Síntomas menstruales", listOrDash(info.menstrualSymptoms)) +
        row("Número de embarazos", info.pregnancyCount) +
        row("Síntomas de embarazo", listOrDash(info.pregnancySymptoms)) +
        row("Síntomas de menopausia", listOrDash(info.menopauseSymptoms))
    );
  }

  if (upToPart >= 4) {
    body += section(
      "Medicamentos Y Alergias",
      row("Medicamentos actuales", info.medications) +
        row("Alergias", info.allergies)
    );
  }

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Helvetica, Arial, sans-serif;
            color: #000;
            padding: 24px;
          }
          h1 {
            font-size: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 20px;
          }
          h2 {
            font-size: 14px;
            margin-top: 24px;
            margin-bottom: 8px;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          td {
            border: 1px solid #999;
            padding: 6px 8px;
            vertical-align: top;
          }
          td.label {
            width: 40%;
            font-weight: bold;
            background-color: #f2f2f2;
          }
          td.value {
            width: 60%;
          }
        </style>
      </head>
      <body>
        <h1>Mi Información Médica</h1>
        ${body}
      </body>
    </html>
  `;
}

export async function generateAndSharePdf(info: MedicalInfo, upToPart: number) {
  const html = buildMedicalHtml(info, upToPart);
  const { uri } = await Print.printToFileAsync({ html });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Mi Información Médica",
    });
  }
}