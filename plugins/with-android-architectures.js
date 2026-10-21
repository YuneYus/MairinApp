// plugins/with-android-architectures.js
//
// Compila el código nativo solo para los procesadores de teléfonos reales.
// Por defecto React Native incluye también x86 y x86_64 (solo emuladores),
// que eran ~50 MB del APK. armeabi-v7a se mantiene para teléfonos de 32 bits.

const { withGradleProperties } = require("expo/config-plugins");

module.exports = function withAndroidArchitectures(config, architectures = ["armeabi-v7a", "arm64-v8a"]) {
  return withGradleProperties(config, (cfg) => {
    cfg.modResults = cfg.modResults.filter(
      (item) => !(item.type === "property" && item.key === "reactNativeArchitectures")
    );
    cfg.modResults.push({ type: "property", key: "reactNativeArchitectures", value: architectures.join(",") });
    return cfg;
  });
};
