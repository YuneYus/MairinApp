// components/DateTimeField.tsx
//
// Campo de fecha y hora para citas y suplementos.
// - Android no tiene selector combinado (mode="datetime" solo abría la fecha):
//   se abre el de fecha y después el de hora.
// - iOS usa el selector combinado.
// - Web no tiene selector nativo en la librería: se usa el campo del navegador.

import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { createElement, useState } from "react";
import { Platform, StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  value: string; // fecha y hora ISO
  onChange: (iso: string) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-10-24T09:00" en hora local, el formato de <input type="datetime-local">. */
function toLocalInput(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function DateTimeField({ value, onChange, style, textStyle }: Props) {
  const [showIosPicker, setShowIosPicker] = useState(false);
  const date = new Date(value);

  if (Platform.OS === "web") {
    return createElement("input", {
      type: "datetime-local",
      value: toLocalInput(date),
      onChange: (event: { target: { value: string } }) => {
        if (event.target.value) onChange(new Date(event.target.value).toISOString());
      },
      style: {
        fontFamily: "inherit",
        fontSize: 15,
        padding: 10,
        borderRadius: 10,
        border: "1px solid #F3C6D3",
        backgroundColor: "#FFFFFF",
        color: "#A4195B",
        marginBottom: 8,
      },
    });
  }

  const openAndroid = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: "date",
      onChange: (event, pickedDate) => {
        if (event.type !== "set" || !pickedDate) return;
        const withDate = new Date(date);
        withDate.setFullYear(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());
        DateTimePickerAndroid.open({
          value: withDate,
          mode: "time",
          is24Hour: false,
          onChange: (timeEvent, pickedTime) => {
            if (timeEvent.type !== "set" || !pickedTime) {
              onChange(withDate.toISOString()); // se queda la fecha nueva con la hora anterior
              return;
            }
            const result = new Date(withDate);
            result.setHours(pickedTime.getHours(), pickedTime.getMinutes(), 0, 0);
            onChange(result.toISOString());
          },
        });
      },
    });
  };

  const label = date.toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <TouchableOpacity
        style={style}
        onPress={() => (Platform.OS === "android" ? openAndroid() : setShowIosPicker((open) => !open))}
      >
        <Text style={textStyle}>{label}</Text>
      </TouchableOpacity>

      {Platform.OS === "ios" && showIosPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="inline"
          onChange={(_event, selected) => {
            if (selected) onChange(selected.toISOString());
          }}
        />
      )}
    </>
  );
}
