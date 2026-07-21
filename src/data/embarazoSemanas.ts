

// data/embarazoSemanas.ts
//
// Shared week-by-week content for "Tu Viaje De Embarazo", used by both
// app/(tabs)/index.tsx and app/(tabs)/detalle-semana.tsx so the two screens
// never drift out of sync.

export type WeekInfo = {
  title: string;
  fact: string;
  feel: string;
  tip: string;
};

export const WEEK_DATA: Record<number, WeekInfo> = {
  1: { title: "El inicio del viaje", fact: "El embarazo se cuenta desde el primer día de tu última regla, aunque la concepción llega después.", feel: "Es probable que todavía no notes ningún síntoma.", tip: "Empieza a tomar ácido fólico si aún no lo haces." },
  2: { title: "La ovulación", fact: "Hacia el final de esta semana ocurre la ovulación, el momento en que un óvulo se libera y puede ser fecundado.", feel: "Puede que notes cambios leves en tu flujo, típicos de la ovulación.", tip: "Mantén buena hidratación y sigue con tu ácido fólico." },
  3: { title: "El óvulo fecundado viaja", fact: "El óvulo fecundado se divide en varias células mientras viaja hacia el útero.", feel: "Podrías sentir una leve sensibilidad, aunque muchas no notan nada aún.", tip: "Evita el alcohol y el tabaco desde ahora." },
  4: { title: "Implantación", fact: "El embrión se implanta en el útero; a veces esto causa un pequeño sangrado.", feel: "Pueden aparecer los primeros síntomas: cansancio o sensibilidad en los senos.", tip: "Haz una prueba de embarazo si tu periodo se retrasa." },
  5: { title: "Late un corazón diminuto", fact: "El corazón del embrión comienza a formarse esta semana.", feel: "Las náuseas matutinas pueden empezar a aparecer.", tip: "Agenda tu primera cita prenatal." },
  6: { title: "El corazón empieza a latir", fact: "El corazón del embrión late por primera vez, aunque aún es difícil de detectar.", feel: "El cansancio y las náuseas suelen intensificarse.", tip: "Come porciones pequeñas y frecuentes si tienes náuseas." },
  7: { title: "Brazos y piernas en camino", fact: "Aparecen pequeños brotes que después serán brazos y piernas.", feel: "Es común la sensibilidad a ciertos olores y sabores.", tip: "Mantente hidratada y descansa cuando lo necesites." },
  8: { title: "Del tamaño de un frijol", fact: "El embrión ya mide cerca de 1.6 cm.", feel: "Los cambios hormonales pueden afectar tu estado de ánimo.", tip: "Pregunta a tu médico por las vitaminas prenatales adecuadas." },
  9: { title: "Ya es oficialmente un feto", fact: "A partir de esta semana, el embrión pasa a llamarse feto.", feel: "El cansancio extremo es muy común en esta etapa.", tip: "Prioriza el descanso y evita el estrés innecesario." },
  10: { title: "Se forman uñas y cabello", fact: "Los dedos de manos y pies ya están separados y empiezan a formarse las uñas.", feel: "Las náuseas pueden estar en su punto más intenso.", tip: "Prueba jengibre o galletas saladas si tienes náuseas." },
  11: { title: "Primeros movimientos", fact: "El feto ya mueve brazos y piernas, aunque todavía no lo sientas.", feel: "Podrías notar que la ropa empieza a quedarte ajustada.", tip: "Considera ropa de maternidad cómoda desde ahora." },
  12: { title: "Pequeñas muecas", fact: "El feto ya puede abrir y cerrar los dedos y hacer muecas.", feel: "Muchas mujeres sienten alivio de las náuseas hacia el final del mes.", tip: "Es buen momento para tu primera ecografía." },
  13: { title: "Fin del primer trimestre", fact: "Se están formando las cuerdas vocales del bebé.", feel: "La energía suele empezar a regresar poco a poco.", tip: "El riesgo de aborto espontáneo baja mucho a partir de ahora." },
  14: { title: "Una vocecita en camino", fact: "Se forman las cuerdas vocales y crece vello fino llamado lanugo.", feel: "Puede que notes un ligero abultamiento en el abdomen.", tip: "Usa ropa cómoda que se adapte a tu cuerpo cambiante." },
  15: { title: "El bebé percibe la luz", fact: "Aunque los párpados siguen cerrados, el bebé ya percibe la luz.", feel: "Tu abdomen empieza a notarse más redondeado.", tip: "Empieza a hidratar tu piel para ayudar a prevenir estrías." },
  16: { title: "Primeras burbujitas", fact: "El bebé ya tiene papilas gustativas y empieza a percibir sabores.", feel: "Podrías sentir los primeros movimientos, como pequeñas burbujas.", tip: "Duerme de lado izquierdo para mejorar la circulación." },
  17: { title: "Acumulando grasita", fact: "El bebé empieza a acumular la grasa que regulará su temperatura.", feel: "El apetito suele aumentar de forma notable.", tip: "Elige snacks nutritivos entre comidas." },
  18: { title: "El bebé empieza a oír", fact: "Los oídos del bebé ya están lo bastante desarrollados para percibir sonidos.", feel: "Es probable que sientas movimientos cada vez más claros.", tip: "Habla o pon música suave para tu bebé." },
  19: { title: "Una capa protectora", fact: "Una sustancia blanca, el vérnix, cubre y protege la piel del bebé.", feel: "El dolor de espalda puede comenzar por el peso adicional.", tip: "Usa calzado cómodo y cuida tu postura." },
  20: { title: "Punto medio del embarazo", fact: "¡Llegaste a la mitad! El bebé mide unos 25 cm.", feel: "Puedes notar más energía y una barriga ya visible.", tip: "Es un buen momento para la ecografía morfológica." },
  21: { title: "Practicando a tragar", fact: "El bebé traga líquido amniótico, lo que ayuda a su sistema digestivo.", feel: "Los movimientos del bebé son cada vez más fuertes.", tip: "Considera empezar clases de preparación para el parto." },
  22: { title: "Rasgos cada vez más definidos", fact: "Se forman las cejas y pestañas del bebé.", feel: "Puede aparecer una hinchazón leve en pies y manos.", tip: "Eleva los pies cuando descanses." },
  23: { title: "¿Fue hipo?", fact: "Los pequeños movimientos rítmicos que sientes podrían ser hipo del bebé.", feel: "Las estrías pueden empezar a notarse en la piel.", tip: "Mantén una buena hidratación durante el día." },
  24: { title: "Los pulmones siguen madurando", fact: "Se forman las vías respiratorias del bebé, aunque aún no funcionan solas.", feel: "Podrías sentir contracciones leves y esporádicas (Braxton Hicks).", tip: "Hazte la prueba de tolerancia a la glucosa si tu médico la indica." },
  25: { title: "Reconoce tu voz", fact: "El bebé ya reconoce y reacciona a sonidos familiares, como tu voz.", feel: "El insomnio puede volverse más frecuente.", tip: "Establece una rutina relajante antes de dormir." },
  26: { title: "Se abren los ojos", fact: "El bebé empieza a abrir los ojos por primera vez.", feel: "La falta de aire puede aumentar conforme el útero crece.", tip: "Practica respiración profunda y mantén una postura erguida." },
  27: { title: "Fin del segundo trimestre", fact: "La actividad cerebral del bebé aumenta cada vez más.", feel: "Puedes notar más cansancio al acercarte al tercer trimestre.", tip: "Empieza a planear tu licencia de maternidad." },
  28: { title: "Comienza el tercer trimestre", fact: "El bebé ya parpadea y tiene ciclos de sueño y vigilia.", feel: "Es buen momento para retomar las visitas médicas cada 2 semanas.", tip: "Empieza a pensar en tu plan de parto." },
  29: { title: "Los músculos maduran", fact: "El cerebro del bebé crece rápido y controla mejor su temperatura.", feel: "Podrías sentir más presión en la zona pélvica.", tip: "Descansa con las piernas elevadas cuando puedas." },
  30: { title: "Sube de peso rápido", fact: "El bebé gana peso rápido, lo que ayuda a regular su temperatura.", feel: "Puede aparecer más hinchazón; avisa si es repentina.", tip: "Prepara la maleta del hospital con calma." },
  31: { title: "Rápido desarrollo cerebral", fact: "El bebé procesa cada vez más información y sigue la luz con los ojos.", feel: "Es común sentirte más cansada y con menos movilidad.", tip: "Empieza a preparar la habitación del bebé." },
  32: { title: "Casi listo para conocerte", fact: "Pulmones y cerebro siguen madurando estas últimas semanas.", feel: "El cansancio físico aumenta; descansa cuando tu cuerpo lo pida.", tip: "Revisa los últimos detalles del plan para el parto." },
  33: { title: "Casi completo por dentro", fact: "Los huesos del cráneo aún no se fusionan, para facilitar el parto.", feel: "Puede aumentar la falta de aire; el bebé ocupa más espacio.", tip: "Prepara la maleta para el hospital con calma." },
  34: { title: "Pulmones casi listos", fact: "El sistema nervioso central del bebé sigue madurando rápido.", feel: "Los movimientos se sienten distintos por el espacio reducido.", tip: "Aprende a reconocer las señales de trabajo de parto." },
  35: { title: "Ganando peso rápido", fact: "Los riñones del bebé ya están completamente desarrollados.", feel: "Puede haber más presión pélvica conforme el bebé desciende.", tip: "Habla con tu médico sobre el plan de parto." },
  36: { title: "Casi a término", fact: "El bebé generalmente ya se coloca cabeza abajo.", feel: "Las contracciones de Braxton Hicks pueden ser más frecuentes.", tip: "Ten listo el hospital y los contactos de emergencia." },
  37: { title: "Oficialmente a término", fact: "El bebé sigue acumulando grasa para regular su temperatura.", feel: "Puede que notes al bebé encajarse más abajo en la pelvis.", tip: "Descansa lo más posible y mantente bien hidratada." },
  38: { title: "Preparándose para nacer", fact: "El cerebro del bebé sigue creciendo muy rápido, incluso tras nacer.", feel: "El insomnio y la ansiedad por el parto son comunes.", tip: "Revisa de nuevo la bolsa del hospital y tus documentos." },
  39: { title: "Cualquier día de estos", fact: "El bebé ya tiene un sistema inmunológico funcional gracias a tus anticuerpos.", feel: "El cansancio y la incomodidad pueden sentirse más intensos.", tip: "Mantente atenta a señales de parto: contracciones regulares o ruptura de fuente." },
  40: { title: "¡Fecha probable de parto!", fact: "Solo un pequeño porcentaje de bebés nace exactamente en esta fecha.", feel: "La expectativa y la ansiedad pueden aumentar; es completamente normal.", tip: "Si aún no hay señales de parto, tu médico hablará contigo sobre los próximos pasos." },
};

export type WeekData = typeof WEEK_DATA;

export function trimesterOf(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}
