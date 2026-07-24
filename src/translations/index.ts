


export const translations = {
  es: {
    inicio: "Inicio",
    calendario: "Calendario",
    ayuda: "Ayuda",
    apoyanos: "Apóyanos",
    perfil: "Perfil",
    bienvenida: "¡Bienvenida",
    guardar: "Guardar",
    cancelar: "Cancelar",
    cerrarSesion: "Cerrar Sesión",
    miPerfil: "Mi Perfil",
    // ...add every string you want translatable, one at a time
  },
  mis: {
    inicio: "Kli", // placeholder — replace with real Miskito translations
    calendario: "Kalindar",
    ayuda: "Help",
    apoyanos: "Support",
    perfil: "Profile",
    bienvenida: "¡Welcome",
    guardar: "Save",
    cancelar: "Cancel",
    cerrarSesion: "Close Session",
    miPerfil: "My Profile",
  },
} as const;

export type TranslationKey = keyof typeof translations["es"];