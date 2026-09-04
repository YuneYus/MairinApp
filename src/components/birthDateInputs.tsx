


import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  day: string;
  month: string;
  year: string;
  onChangeDay: (v: string) => void;
  onChangeMonth: (v: string) => void;
  onChangeYear: (v: string) => void;
};

export default function BirthDateInputs({
  day, month, year, onChangeDay, onChangeMonth, onChangeYear,
}: Props) {
  return (
    <View style={styles.row}>
      <TextInput style={[styles.input, styles.flex]} placeholder="día" placeholderTextColor="#C9A9BB" keyboardType="number-pad" maxLength={2} value={day} onChangeText={onChangeDay} />
      <TextInput style={[styles.input, styles.flex]} placeholder="mes" placeholderTextColor="#C9A9BB" keyboardType="number-pad" maxLength={2} value={month} onChangeText={onChangeMonth} />
      <TextInput style={[styles.input, styles.flex]} placeholder="año" placeholderTextColor="#C9A9BB" keyboardType="number-pad" maxLength={4} value={year} onChangeText={onChangeYear} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  flex: { flex: 1 },
  input: { backgroundColor: "#FDE8EF", color: "#B0195B", padding: 14, borderRadius: 12, fontSize: 15, textAlign: "center" },
});