let sesion = { comisaria: "", jefe: "", puntaje: 100, completados: [] };

// URL DE TU PROYECTO EN LA NUBE (GOOGLE APPS SCRIPT)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRxjPLtF55uJqkpYWRQlMM8VGtCil9P9TWXJh4ut27fyvP7s9-_9BQbTv3SNczE24/exec";

// NÓMINA OFICIAL PURA - IES POLICIAL (ACTUALIZADA)
const nominaDependencias = [
    "Comisaría Seccional 1ª (Aybar, Etchenique, Gerez, Ruiz)",
    "Comisaría Seccional 2ª (Suárez, Valdez, Dib, Las Heras Cabocota, Montero)",
    "Comisaría Seccional 3ª (Del Lugo F., Ocaranza, Sotelo, Lazarte)",
    "Comisaría Seccional 4ª (Bareiro, Palomar, Villagra, Ruiz Lozano, Salas Murua Javier)",
    "Comisaría Seccional 5ª (Abregú, Medina, Rojas, Quiroga, Villalba)",
    "Comisaría Seccional 6ª (Carrizo, Gómez, Iramain, Ybarra, Coronel)",
    "Comisaría Seccional 7ª (Forales, Chávez, Juárez, Girvau, Fernández)",
    "Comisaría Seccional 8ª (Mercado, Brandán, Vizcarra, Aguirre, Carrillo)",
    "Comisaría Seccional 9ª (Argañaraz, Ávila, Bazán, Moreno, Huergo Ismael)",
    "Comisaría Seccional 10ª (Gramajo, Pintos, Verón, Frias, Soria)",
    "Comisaría Seccional 11ª (Oliva, Salas, Díaz, Zárate Medina)",
    "Comisaría Seccional 12ª (Juárez, Alabarce, Ruiz, Paz Maria, Miro Gaston)",
    "Comisaría Seccional 13ª (Alvarado, Ruiz, Argañaraz Lescano, Sotelo, Quinteros)",
    "Comisaría Seccional 14ª (Galván, Ramos, Nieva, Páez Fernández)",
    "Comisaría Seccional 15ª (Centeno, Contreras, Guardia, Gómez Ramírez, Zamorano)"
];

document.addEventListener("DOMContentLoaded", function() {
    const selectComisaria = document.getElementById('comisaria');
    if(selectComisaria) {
        selectComisaria.innerHTML = '<option value="">-- Seleccione su Dependencia --</option>';
        nominaDependencias.forEach(dep => {
            let option = document.createElement('option');
            option.value = dep;
            option.textContent = dep;
            selectComisaria.appendChild(option);
        });

        const loginForm = document.getElementById('login-form');
        if(loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const comisariaSelect = document.getElementById('comisaria').value;
                const jefeInput = document.getElementById('jefe').value;

                if(!comisariaSelect || !jefeInput) {
                    alert("Por favor, seleccione su dependencia y complete el nombre del oficial a cargo.");
                    return;
                }

                sesion.comisaria = comisariaSelect;
                sesion.jefe = jefeInput;

                let sesionGuardada = {
                    comisaria: sesion.comisaria,
                    jefe: sesion.jefe,
                    completados: [],
                    respuestas: []
                };
                localStorage.setItem('sesion_' + sesion.comisaria, JSON.stringify(sesionGuardada));

                const sirena = document.getElementById('sirena-audio');
                if(sirena) {
                    sirena.volume = 1.0;
                    sirena.play().catch(err => console.log("Audio bloqueado:", err));
                }

                document.getElementById('login-section').classList.add('hidden');
                document.getElementById('dashboard-section').classList.remove('hidden');

                document.getElementById('display-comisaria').innerText = sesion.comisaria;
                document.getElementById('display-jefe').innerText = sesion.jefe;
            });
        }
    }

    const liveTableBody = document.getElementById('live-table-body');
    if(liveTableBody) {
        actualizarMonitoreoEnVivo();
        setInterval(actualizarMonitoreoEnVivo, 3000);
    }

    document.addEventListener('change', function(e) {
        if(e.target.type === 'checkbox') {
            const beep = document.getElementById('beep-tactico');
            if(beep) {
                beep.currentTime = 0;
                beep.play().catch(err => console.log(err));
            }
        }
    });
});

// BANCO MAESTRO: 5 MÓDULOS DE 20 ÍTEMS CADA UNO (100 OPCIONES TOTALES)
const modulosData = {
    1: {
        titulo: "Módulo 1: Arribo, Perímetro y Control de Masas",
        instruccion: "En base al despliegue en el Parque 9 de Julio, la muchedumbre hostil y la escena crítica, marque <u>todas</u> las pautas de acción obligatorias y descarte las trampas procesales (20 ítems):",
        opciones: [
            { id: '1_1', tipo: 'trampa', texto: "Ingresar de inmediato al habitáculo abriendo la puerta principal por el camino más directo para constatar signos vitales sin importar el trayecto.", fundacion: "Violación grave de la cadena de custodia y alteración de rastros papilares en la zona núcleo." },
            { id: '1_2', tipo: 'acierto', texto: "Establecer y utilizar un único carril de acceso y egreso balizado para todo el personal interviniente, evitando contaminar la zona con nuevos rastros.", fundacion: "Excelente praxis pericial. Preserva la intangibilidad de la escena." },
            { id: '1_3', tipo: 'acierto', texto: "Disponer un doble anillo perimetral de seguridad con móviles y personal para contener el avance de curiosos y familiares hostiles.", fundacion: "Correcta contención táctica y control de masas en entornos urbanos abiertos." },
            { id: '1_4', tipo: 'trampa', texto: "Tomar declaraciones informales rápidas a los curiosos del tumulto para ganar tiempo antes de que se dispersen.", fundacion: "Nulidad testimonial. Las entrevistas informales no reemplazan el acta testimonial formal." },
            { id: '1_5', tipo: 'acierto', texto: "Inspeccionar visualmente el estado del arma de fuego y municiones sin modificar su posición ni tocarlas sin peritos.", fundacion: "Adecuado resguardo de indicios materiales sujetos a posterior peritaje balístico." },
            { id: '1_6', tipo: 'trampa', texto: "Recoger el arma y la vaina servida del suelo para resguardarlas en la dependencia ante el riesgo de sustracción.", fundacion: "Vicio insubsanable. La remoción unilateral de armas sin perito destruye la traza dactiloscópica." },
            { id: '1_7', tipo: 'acierto', texto: "Subordinar cada movimiento operativo a las disposiciones del Código Procesal Penal, delimitando prevención e investigación.", fundacion: "Estricto apego al principio de legalidad y respeto de las órbitas fiscales." },
            { id: '1_8', tipo: 'trampa', texto: "Permitir que los medios de prensa crucen la cinta perimetral si prometen no pisar cerca del vehículo.", fundacion: "Exposición indebida de la escena del crimen y riesgo de contaminación probatoria." },
            { id: '1_9', tipo: 'acierto', texto: "Designar personal específico para el registro y control de ingreso vehicular y peatonal en el anillo externo.", fundacion: "Óptima gestión administrativa y de trazabilidad en el perímetro." },
            { id: '1_10', tipo: 'trampa', texto: "Permitir que los familiares ingresen a la zona núcleo si se comprometen a llorar en silencio sin tocar el cuerpo.", fundacion: "Violación del aislamiento de la escena y alteración biológica y material." },
            { id: '1_11', tipo: 'acierto', texto: "Mantener los estrobos y balizas de los móviles encendidos para señalizar la zona crítica y advertir el perímetro.", fundacion: "Correcta señalización preventiva de la zona de alto riesgo." },
            { id: '1_12', tipo: 'trampa', texto: "Desplazar los móviles policiales del perímetro para liberar la calle apenas llegue la prensa.", fundacion: "Pérdida de control del anillo de seguridad y exposición de la zona crítica." },
            { id: '1_13', tipo: 'acierto', texto: "Coordinar de manera sincronizada el ingreso seguro de la unidad sanitaria asegurando un corredor biológico limpio.", fundacion: "Articulación correcta entre la urgencia médica humanitaria y la preservación pericial." },
            { id: '1_14', tipo: 'trampa', texto: "Permitir que los operadores sanitarios remuevan el vehículo antes de Criminalística si el tráfico se congestiona.", fundacion: "Alteración total de la escena del hecho antes del relevamiento técnico." },
            { id: '1_15', tipo: 'acierto', texto: "Restringir el uso de teléfonos particulares a los efectivos dentro del anillo perimetral para evitar filtraciones.", fundacion: "Medida ejemplar para evitar la filtración ilegal de evidencia digital a redes sociales." },
            { id: '1_16', tipo: 'acierto', texto: "Habilitar un puesto de mando unificado en el perímetro externo para recibir directivas y articular con fiscales.", fundacion: "Coordinación operativa centralizada conforme a protocolos de comando." },
            { id: '1_17', tipo: 'trampa', texto: "Dejar que los efectivos ingresen en grupo compacto sin registrar quiénes pisaron la escena para ahorrar tiempo administrativo.", fundacion: "Contaminación masiva de la escena sin trazabilidad del personal." },
            { id: '1_18', tipo: 'acierto', texto: "Verificar la colocación de cartelería o elementos visibles de advertencia perimetral a distancia prudencial.", fundacion: "Correcta delimitación física del área restringida." },
            { id: '1_19', tipo: 'trampa', texto: "Retirar las cintas perimetrales transcurridos treinta minutos si el fiscal demora en arribar al lugar.", fundacion: "Abandono prematuro de la intangibilidad de la escena." },
            { id: '1_20', tipo: 'acierto', texto: "Designar un oficial responsable exclusivo de custodiar la intangibilidad de la zona núcleo de forma permanente.", fundacion: "Garantía operativa fundamental para evitar ingresos no autorizados." }
        ]
    },
    2: {
        titulo: "Módulo 2: Investigación Activa y Testigos Dubitativos",
        instruccion: "Ante la información imperfecta y el entorno caótico, marque <u>todas</u> las medidas correctas de investigación de campo y gestión de testigos (20 ítems):",
        opciones: [
            { id: '2_1', tipo: 'acierto', texto: "Identificar selectivamente al testigo ocular real y aislarlo de inmediato del tumulto para evitar contaminación.", fundacion: "Correcto resguardo de la fuente cognitiva frente a la contaminación colectiva." },
            { id: '2_2', tipo: 'trampa', texto: "Dar por ciertas las afirmaciones de los transeúntes sobre la identidad de los autores y consignarlas como hechos cerrados.", fundacion: "Error sumarial grave. Incorporar rumores como verdades probadas vicia el acta." },
            { id: '2_3', tipo: 'acierto', texto: "Registrar formalmente en notas de campo la distinción estricta entre dichos de terceros y constatación directa propia.", fundacion: "Impecable rigor profesional en la distinción entre percepción directa y referencial." },
            { id: '2_4', tipo: 'trampa', texto: "Tomar una declaración testimonial formal en la escena misma al testigo asustado para asegurar su relato.", fundacion: "Nulidad procesal. Las testimoniales formales no deben recibirse en caliente en la vía pública." },
            { id: '2_5', tipo: 'acierto', texto: "Asegurar que el testigo retenido permanezca a disposición de las autoridades judiciales sin inducir respuestas.", fundacion: "Respeto a las garantías constitucionales y neutralidad en el relevamiento." },
            { id: '2_6', tipo: 'trampa', texto: "Descartar los comentarios de los vecinos y no indagar en el entorno para evitar perder tiempo.", fundacion: "Omisión investigativa. El radio inmediato de vecinos es fuente primaria de indicios." },
            { id: '2_7', tipo: 'acierto', texto: "Indagar discretamente sobre posibles trayectorias de fuga aportadas por comerciantes de la periferia.", fundacion: "Buena praxis en la recolección temprana de vestigios de huida." },
            { id: '2_8', tipo: 'trampa', texto: "Amenazar con detener al testigo dubitativo si no declara exactamente lo que los oficiales suponen.", fundacion: "Coacción ilegal de testigos. Delito funcional y nulidad absoluta." },
            { id: '2_9', tipo: 'acierto', texto: "Consultar al testigo sobre características físicas o dirección de huida sin sugerir respuestas directas.", fundacion: "Entrevista abierta y desprovista de sugestión policial." },
            { id: '2_10', tipo: 'trampa', texto: "Formular preguntas capciosas para orientar la memoria del testigo hacia un sospechoso conocido.", fundacion: "Vicio metodológico en la obtención de datos que invalida judicialmente el testimonio." },
            { id: '2_11', tipo: 'trampa', texto: "Inspeccionar los teléfonos celulares hallados manipulando su pantalla y leyendo mensajes sin orden judicial.", fundacion: "Violación flagrante de la intimidad y de la garantía contra la autoincriminación (Fallos CSJN)." },
            { id: '2_12', tipo: 'acierto', texto: "Asegurar los dispositivos electrónicos detectados sin manipular sus interfaces, disponiendo su aislamiento en bolsas faraday.", fundacion: "Correcto resguardo técnico de evidencia digital sin vulnerar sistemas." },
            { id: '2_13', tipo: 'trampa', texto: "Seleccionar como testigos de actuación a personas vinculadas orgánicamente con la dependencia policial.", fundacion: "Falta de imparcialidad de los testigos instrumentales, causal de nulidad." },
            { id: '2_14', tipo: 'acierto', texto: "Documentar minuciosamente las contradicciones entre los distintos relatos para someterlas a análisis pericial.", fundacion: "Registro objetivo de discordancias testimoniales para evaluación fiscal." },
            { id: '2_15', tipo: 'trampa', texto: "Obligar a los testigos presenciales a firmar actas pre-redactadas en la comisaría sin presenciar su confección.", fundacion: "Falsedad ideológica y violación de las normas de instrumentos públicos." },
            { id: '2_16', tipo: 'acierto', texto: "Verificar existencia de cámaras aledañas entrevistando directamente a encargados de seguridad privada.", fundacion: "Acciones ágiles de relevamiento tecnológico periférico." },
            { id: '2_17', tipo: 'trampa', texto: "Permitir que los mirones opinen libremente en el acta sobre quién consideran que cometió el delito.", fundacion: "Incorporación de subjetividades comunitarias carentes de valor legal al sumario." },
            { id: '2_18', tipo: 'acierto', texto: "Individualizar a los primeros informantes anónimos orientando formalmente su aporte al sumario preventivo.", fundacion: "Correcta canalización de datos preliminares de interés investigativo." },
            { id: '2_19', tipo: 'trampa', texto: "Omitir registrar los datos filiatorios del testigo por considerarlo un trámite secundario.", fundacion: "Pérdida de individualización de la fuente de prueba testimonial." },
            { id: '2_20', tipo: 'acierto', texto: "Establecer un canal seguro para que los testigos aporten datos de identidad reservada bajo tutela fiscal.", fundacion: "Protección adecuada de testigos en causas por delitos graves." }
        ]
    },
    3: {
        titulo: "Módulo 3: Fijación de Condiciones y Espacio Gris",
        instruccion: "Para documentar con rigor absoluto el escenario imperfecto, marque <u>todas</u> las variables ambientales, temporales y tecnológicas obligatorias (20 ítems):",
        opciones: [
            { id: '3_1', tipo: 'acierto', texto: "Construir un registro minucioso de la visibilidad, condiciones climáticas e iluminación existente al momento del arribo.", fundacion: "Vital para dictámenes periciales accidentológicos o balísticos." },
            { id: '3_2', tipo: 'trampa', texto: "Omitir los detalles del entorno lumínico por considerarlos datos menores que no hacen a la balística.", fundacion: "Deficiencia técnica que impide evaluar las condiciones de visibilidad en juicio." },
            { id: '3_3', tipo: 'acierto', texto: "Relevar de inmediato la presencia de cámaras de seguridad públicas o privadas en las inmediaciones directas.", fundacion: "Aseguramiento oportuno de fuentes de prueba fílmica antes del soplado de buffers." },
            { id: '3_4', tipo: 'acierto', texto: "Anotar con precisión cronológica exacta los horarios de aviso, llegada y despliegue para evitar baches temporales.", fundacion: "Elimina baches temporales que la defensa utiliza para cuestionar la actuación." },
            { id: '3_5', tipo: 'trampa', texto: "Dejar asentado genéricamente que el parque estaba totalmente vacío para simplificar el acta.", fundacion: "Falsedad material y ocultamiento de circunstancias circundantes relevantes." },
            { id: '3_6', tipo: 'trampa', texto: "Constatar dominios circundantes sin realizar constancias escritas si no hay un perito físico presente.", fundacion: "Omisión de constancias documentales obligatorias del primer interviniente." },
            { id: '3_7', tipo: 'acierto', texto: "Documentar la orientación cardinal exacta de la camioneta y la disposición de accesos al Palacio de los Deportes.", fundacion: "Excelente croquis y descripción topográfica inicial de la escena." },
            { id: '3_8', tipo: 'trampa', texto: "Prescindir de registrar rastros de frenada o huellas en el suelo por considerarlo competencia exclusiva viales.", fundacion: "Pérdida de vestigios dinámicos transitorios que se borran con el clima." },
            { id: '3_9', tipo: 'acierto', texto: "Registrar la posición de elementos colindantes (cestos, bancos, árboles) que delimiten geográficamente la escena.", fundacion: "Referenciamiento espacial sólido para la planicie judicial." },
            { id: '3_10', tipo: 'trampa', texto: "Estimar los horarios de forma aproximada al finalizar la jornada laboral para no retrasar el papelerío.", fundacion: "Imprecisión temporal inaceptable en sumarios por delitos graves." },
            { id: '3_11', tipo: 'trampa', texto: "Prescindir del relevamiento de fluidos biológicos si las condiciones climáticas amenazan con degradarlos.", fundacion: "Pérdida negligente de evidencia biológica de alto valor identificatorio." },
            { id: '3_12', tipo: 'acierto', texto: "Constatar dominios circundantes asegurando trazabilidad de registros fílmicos bajo cadena de custodia.", fundacion: "Garantía de intangibilidad y legalidad de la prueba digital." },
            { id: '3_13', tipo: 'acierto', texto: "Describir pormenorizadamente el estado de accesos viales perimetrales y presencia de obstáculos fijos o móviles.", fundacion: "Detalle pericial completo del escenario." },
            { id: '3_14', tipo: 'trampa', texto: "Obviar la constatación de temperatura ambiente y humedad bajo pretexto de que no influyen en la labor.", fundacion: "Omisión de factores ambientales que alteran indicios químicos o cadavéricos." },
            { id: '3_15', tipo: 'acierto', texto: "Registrar de manera rigurosa la secuencia de ingreso y egreso de cada funcionario o perito que pisó la zona.", fundacion: "Control absoluto de la cadena de tránsito humano en la escena." },
            { id: '3_16', tipo: 'acierto', texto: "Consignar los números de internos o identificaciones de los móviles que cerraron el primer anillo de contención.", fundacion: "Identificación institucional precisa de los recursos afectados." },
            { id: '3_17', tipo: 'trampa', texto: "Dar por sentado que el clima no varió durante las horas previas sin verificar registros meteorológicos.", fundacion: "Falta de rigor científico en la fijación ambiental del hecho." },
            { id: '3_18', tipo: 'acierto', texto: "Anotar la existencia de charcos, dirección de escurrimiento de fluidos o acumulación pluvial en la calzada.", fundacion: "Detalle topográfico clave para reconstrucción balística o criminalística." },
            { id: '3_19', tipo: 'trampa', texto: "Desestimar el registro de sombras u obstáculos cenitales proyectados por el arbolado del parque en horario nocturno.", fundacion: "Omisión de factores lumínicos naturales determinantes en la visibilidad." },
            { id: '3_20', tipo: 'acierto', texto: "Elaborar un acta complementaria de estado meteorológico y lumínico firmada por los preventores actuantes.", fundacion: "Resguardo documental idóneo de las condiciones ambientales iniciales." }
        ]
    },
    4: {
        titulo: "Módulo 4: Intervención Correcta del Lugar, Hecho de Sangre y Vehículos Adulterados",
        instruccion: "Frente a un hecho de sangre con persona fallecida y vehículo con numeración aparentemente adulterada, determine los pasos correctos (constatación vital, perímetro, aviso judicial, ECIF, bomberos, calidad de traslado) y descarte trampas sutiles (20 ítems):",
        opciones: [
            { id: '4_1', tipo: 'acierto', texto: "Constatar formalmente la ausencia de signos vitales por profesional médico antes de mover elementos, perimetrando y dando aviso a autoridades judiciales.", fundacion: "Cumplimiento estricto del protocolo: la verificación médica certifica el deceso y preserva la escena." },
            { id: '4_2', tipo: 'trampa', texto: "Dar aviso telefónico informal al fiscal relatando el suceso de palabra y continuar actuaciones sin esperar instrucción documentada para no demorar.", fundacion: "Trampa procesal sutil: la prevención debe asentar de puño y letra comunicación, hora y directivas exactas." },
            { id: '4_3', tipo: 'acierto', texto: "Recabar con celeridad información de testigos presenciales y verificar cámaras de seguridad públicas o privadas en el radio de influencia.", fundacion: "Adquisición oportuna de prueba volátil indispensable para la teoría del caso fiscal." },
            { id: '4_4', tipo: 'acierto', texto: "Registrar detalladamente en acta la nómina de autoridades y equipos presentes (ECIF, Criminalística, Médicos) consignando horarios exactos.", fundacion: "Asegura la trazabilidad y la intangibilidad del procedimiento ante planteos de intervención." },
            { id: '4_5', tipo: 'trampa', texto: "Consignar en acta que el médico y peritos arribaron 'aproximadamente a las 16:00 hs' para evitar discusiones de minutos con la defensa.", fundacion: "Defecto sumarial grave: la estimación laxa de horarios en instrumentos públicos es causal de nulidad." },
            { id: '4_6', tipo: 'acierto', texto: "Asentar documentalmente la intervención del médico de policía, peritos de Criminalística/ECIF y personal de Sustracción de Automotores.", fundacion: "Integración formal y multidisciplinaria de áreas periciales competentes." },
            { id: '4_7', tipo: 'acierto', texto: "Coordinar el levantamiento y traslado del occiso exclusivamente a través de la División Bomberos bajo orden expresa judicial.", fundacion: "Resguardo de la cadena de custodia cadavérica bajo el organismo policial legalmente facultado." },
            { id: '4_8', tipo: 'trampa', texto: "Permitir que el personal de la comisaría colabore subiendo el cuerpo a la morguera si bomberos demora, para descomprimir la vía pública.", fundacion: "Contaminación grave y alteración biológica: los preventores no deben manipular el óbito." },
            { id: '4_9', tipo: 'acierto', texto: "Disponer el secuestro y traslado del vehículo adulterado bajo inventario, especificando calidad procesal y emitiendo notas de remisión sin presagiar robos.", fundacion: "Garantía de debido proceso: el rodado queda a disposición judicial como pieza de convicción." },
            { id: '4_10', tipo: 'trampa', texto: "Asentar taxativamente en el acta que el vehículo es 'sustraído y de procedencia ilícita' basándose en la sola observación visual de los dígitos limados.", fundacion: "Exceso pericial preventivo: el policía no puede afirmar un delito registral sin peritaje revenido químico." },
            { id: '4_11', tipo: 'acierto', texto: "Garantizar la lectura íntegra del acta redactada a los testigos hábiles de actuación antes de proceder a la rúbrica formal.", fundacion: "Cumplimiento del recaudo esencial de validez instrumental previsto en el Código Procesal." },
            { id: '4_12', tipo: 'trampa', texto: "Limpiar o raspar con un trapo la zona del motor o chasis donde se observan signos de manipulación para verificar mejor antes de que llegue el perito.", fundacion: "Alteración directa de evidencia material: la fricción destruye micro-marcas útiles." },
            { id: '4_13', tipo: 'acierto', texto: "Salvar formalmente de puño y letra cualquier enmienda o interlineado efectuado durante la confección manuscrita del acta antes de firmas.", fundacion: "Preserva la fe pública del instrumento e impide planteos de falsedad ideológica." },
            { id: '4_14', tipo: 'trampa', texto: "Dejar espacios en blanco o renglones libres al finalizar párrafos principales del acta para facilitar agregados posteriores si el fiscal pide más datos.", fundacion: "Vicio sumarial grosero: habilita sospecha de adulteración documental o interpolación." },
            { id: '4_15', tipo: 'acierto', texto: "Asegurar intangibilidad del documento primario remitiendo actuaciones originales a sede judicial dentro de plazos legales perentorios.", fundacion: "Acatamiento de límites temporales procesales que legitiman la prevención." },
            { id: '4_16', tipo: 'trampa', texto: "Delegar la redacción total del sumario a personal civil o pasantes administrativos para agilizar el expediente.", fundacion: "Ilegalidad en el ejercicio de funciones públicas esenciales reservadas a policía judicial." },
            { id: '4_17', tipo: 'acierto', texto: "Emitir formalmente notas de estilo y oficios de comunicación a dependencias registrales competentes en paralelo con la remisión judicial.", fundacion: "Correcta articulación interinstitucional en la faz investigativa vehicular." },
            { id: '4_18', tipo: 'trampa', texto: "Omitir registrar el dominio o numeración de chasis parcial visible en las piezas sumariales por resultar ilegible a simple vista.", fundacion: "Omisión de constancias identificatorias primarias del automotor." },
            { id: '4_19', tipo: 'acierto', texto: "Documentar fotográficamente el estado integral de la numeración vehicular adulterada en presencia de testigos instrumentales.", fundacion: "Fijación objetiva inalterable del estado del cuerpo de delito vehicular." },
            { id: '4_20', tipo: 'trampa', texto: "Autorizar la entrega informal del vehículo a un supuesto familiar que exhiba cédula verde sin intervención del fiscal.", fundacion: "Entrega ilegal de efectos sujetos a secuestro judicial e investigación dominial." }
        ]
    },
    5: {
        titulo: "Módulo 5: Rigor Procesal, Cadena de Custodia y Blindaje Sumarial",
        instruccion: "Para blindar el procedimiento ante los planteos de la defensa técnica en tribunales, marque <u>todas</u> las exigencias sumariales correctas y normas de cadena de custodia (20 ítems):",
        opciones: [
            { id: '5_1', tipo: 'acierto', texto: "Subordinar cada medida a los límites procesales entre facultades de prevención y actos de investigación exclusivos de fiscalía.", fundacion: "Acatamiento estricto de la división de roles procesales entre policía y fiscalía." },
            { id: '5_2', tipo: 'trampa', texto: "Avanzar en una carátula definitiva de homicidio por ajuste de cuentas en el acta inicial para demostrar eficacia.", fundacion: "Exceso funcional. La calificación legal es atribución exclusiva del Ministerio Público Fiscal y el juez." },
            { id: '5_3', tipo: 'acierto', texto: "Confeccionar el acta de prevención respetando la normativa legal e incluyendo designación fehaciente de testigos hábiles.", fundacion: "Instrumento público formalmente válido y blindado ante planteos de nulidad." },
            { id: '5_4', tipo: 'trampa', texto: "Omitir la firma de los testigos instrumentales en el acta de procedimiento bajo argumento de urgencia horaria.", fundacion: "Nulidad absoluta del instrumento público por ausencia de testigos obligatorios de ley." },
            { id: '5_5', tipo: 'acierto', texto: "Consignar de forma clara datos identificatorios completos de preventores intervinientes y autoridad judicial informada.", fundacion: "Legitimación procesal clara de los funcionarios actuantes." },
            { id: '5_6', tipo: 'trampa', texto: "Utilizar abreviaturas confusas, términos jeróglifos o lenguaje informal no técnico en la redacción de piezas públicas.", fundacion: "Defecto formal de redacción que obstaculiza la comprensión judicial del sumario." },
            { id: '5_7', tipo: 'acierto', texto: "Asegurar intangibilidad del documento primario evitando alteraciones o agregados posteriores fuera de término legal.", fundacion: "Integridad documental garantizada." },
            { id: '5_8', tipo: 'trampa', texto: "Dejar el libro de actas sin cerrar ni rubricar al finalizar el procedimiento bajo custodia del preventor más moderno.", fundacion: "Vulneración de la seguridad documental interna de la dependencia." },
            { id: '5_9', tipo: 'acierto', texto: "Transmitir a fiscalía un reporte preliminar objetivo y despojado de conjeturas subjetivas o hipótesis precipitadas.", fundacion: "Informe pulcro, objetivo y centrado estrictamente en los hechos constatados." },
            { id: '5_10', tipo: 'trampa', texto: "Permitir que efectivos sin guantes manipulen vainas servidas o elementos balísticos para ver su calibre a contraluz.", fundacion: "Destrucción total de huellas dactilares latentes y ADN de contacto." },
            { id: '5_11', tipo: 'acierto', texto: "Asegurar que cada secuestro material posea su respectivo precinto, etiqueta de identificación y cadena de custodia firmada.", fundacion: "Garantía procesal inquebrantable de mismidad de la evidencia." },
            { id: '5_12', tipo: 'trampa', texto: "Guardar las vainas servidas y proyectiles sueltos en el bolsillo del uniforme preventor para llevarlos a la comisaría.", fundacion: "Contaminación cruzada gravísima y ruptura total de la cadena de custodia." },
            { id: '5_13', tipo: 'acierto', texto: "Labrar actas de secuestro independientes por cada elemento incautado con detalle morfológico y signatura de testigos.", fundacion: "Forma legal idónea para documentar la incorporación de efectos al proceso." },
            { id: '5_14', tipo: 'trampa', texto: "Consignar genéricamente 'varios elementos de interés' en el acta sin individualizar cada objeto secuestrado.", fundacion: "Vaguedad descriptiva que invalida el secuestro en la etapa de debate oral." },
            { id: '5_15', tipo: 'acierto', texto: "Remitir los efectos secuestrados bajo estrictas normas de seguridad a los gabinetes periciales correspondientes.", fundacion: "Resguardo físico institucional de la evidencia material." },
            { id: '5_16', tipo: 'trampa', texto: "Exhibir armas o elementos secuestrados ante la prensa o curiosos en la vía pública para alardear el procedimiento.", fundacion: "Violación del secreto sumarial y exposición indebida de efectos procesales." },
            { id: '5_17', tipo: 'acierto', texto: "Verificar la coincidencia exacta entre datos filiatorios de documentos de identidad y los plasmados en el sumario.", fundacion: "Exactitud en la filiación de personas involucradas en el hecho." },
            { id: '5_18', tipo: 'trampa', texto: "Completar filiaciones de personas demoradas estimando sus datos de memoria sin solicitar los documentos físicos.", fundacion: "Incurrir en errores filiatorios que obstaculizan la identificación judicial." },
            { id: '5_19', tipo: 'acierto', texto: "Archivar los cargos de recepción y actas de entrega en bibliorato sumarial específico bajo custodia de oficial jefe.", fundacion: "Orden administrativo y contable interno en la instrucción preliminar." },
            { id: '5_20', tipo: 'trampa', texto: "Prestar las actuaciones sumariales originales a terceros ajenos a la fuerza para su lectura particular.", fundacion: "Violación de deberes de funcionario público y pérdida de custodia documental." }
        ]
    }
};

function abrirModulo(id) {
    const radio = document.getElementById('radio-audio');
    if(radio) radio.play().catch(err => console.log(err));

    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('station-modal').classList.remove('hidden');

    const mod = modulosData[id];
    document.getElementById('mod-title').innerText = mod.titulo;
    
    let html = `<div class="scenario-box"><strong>INSTRUCCIÓN TÁCTICA:</strong> ${mod.instruccion}</div>`;

    html += `<form id="multiple-form">`;
    mod.opciones.forEach(op => {
        html += `<label class="checkbox-label" style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px;">
            <input type="checkbox" name="eval_op" value="${op.id}" data-tipo="${op.tipo}" style="margin-top:3px;"> 
            <span>${op.texto}</span>
        </label>`;
    });
    html += `<button type="button" class="btn-tactical-3d" onclick="evaluarModulo(${id})">Registrar Decisiones del Bloque</button></form>`;
    html += `<div id="feedback-container"></div>`;

    document.getElementById('mod-body').innerHTML = html;
}

function evaluarModulo(modId) {
    const checkboxes = document.querySelectorAll('input[name="eval_op"]');
    let respuestasModulo = [];
    
    checkboxes.forEach(cb => {
        if(cb.checked) {
            respuestasModulo.push({
                opcionId: cb.value,
                tipo: cb.getAttribute('data-tipo'),
                texto: cb.parentElement.querySelector('span').innerText.trim()
            });
        }
    });

    let sesionGuardada = JSON.parse(localStorage.getItem('sesion_' + sesion.comisaria)) || { comisaria: sesion.comisaria, jefe: sesion.jefe, completados: [], respuestas: [] };
    sesionGuardada.jefe = sesion.jefe;
    if(!sesionGuardada.completados.includes(modId)) {
        sesionGuardada.completados.push(modId);
    }
    sesionGuardada.respuestas = sesionGuardada.respuestas.filter(r => r.modulo !== modId).concat(respuestasModulo.map(r => ({modulo: modId, ...r})));
    localStorage.setItem('sesion_' + sesion.comisaria, JSON.stringify(sesionGuardada));

    if (GOOGLE_SCRIPT_URL) {
        let payload = {
            comisaria: sesion.comisaria,
            jefe: sesion.jefe,
            modulo: "Módulo " + modId,
            respuestas: respuestasModulo
        };

        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        }).catch(err => console.log("Error nube:", err));
    }

    marcarCompletado(modId);
}

function marcarCompletado(modId) {
    if(!sesion.completados.includes(modId)) {
        sesion.completados.push(modId);
        document.getElementById(`btn-mod-${modId}`).classList.add('completed');
    }

    if(sesion.completados.length === 5) {
        mostrarPantallaFinalizacionTotal();
    } else {
        mostrarPantallaTransicionModulo(modId);
    }
}

function mostrarPantallaTransicionModulo(modId) {
    document.getElementById('station-modal').classList.add('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');

    let transicionSec = document.getElementById('transition-section');
    if(!transicionSec) {
        transicionSec = document.createElement('section');
        transicionSec.id = 'transition-section';
        transicionSec.className = 'tactical-card glass-panel';
        document.querySelector('.tactical-container').appendChild(transicionSec);
    }

    transicionSec.innerHTML = `
        <div style="text-align: center; padding: 25px 10px;">
            <div style="font-size: 40px; margin-bottom: 12px;">🛡️📋</div>
            <h2 style="color: #38bdf8; font-size: 18px; margin-bottom: 15px; text-transform: uppercase;">Estación evaluada con éxito</h2>
            <p class="desc-text" style="font-size: 13px; line-height: 1.6; color: #e2e8f0; margin-bottom: 20px;">
                El equipo ha registrado sus decisiones en este bloque de intervención táctico-sumarial.
            </p>
            <div style="background: #030712; padding: 12px; border-radius: 6px; border: 1px solid #0284c7; margin-bottom: 20px; font-size: 12px; color: #38bdf8;">
                <strong>CÉLULA OPERATIVA:</strong> ${sesion.comisaria}<br>
                Oficial a Cargo: ${sesion.jefe}
            </div>
            <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 25px; text-transform: uppercase;">
                ➔ Seleccione la siguiente estación para continuar.
            </p>
            <button type="button" class="btn-tactical-3d" onclick="volverDashboardDesdeTransicion()">
                🚀 Seleccionar Siguiente Bloque
            </button>
        </div>
    `;
    transicionSec.classList.remove('hidden');
}

function mostrarPantallaFinalizacionTotal() {
    document.getElementById('station-modal').classList.add('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');

    let transicionSec = document.getElementById('transition-section');
    if(!transicionSec) {
        transicionSec = document.createElement('section');
        transicionSec.id = 'transition-section';
        transicionSec.className = 'tactical-card glass-panel';
        document.querySelector('.tactical-container').appendChild(transicionSec);
    }

    transicionSec.innerHTML = `
        <div style="text-align: center; padding: 30px 15px;">
            <div style="font-size: 45px; margin-bottom: 15px;">⚖️🎓</div>
            <h2 style="color: #10b981; font-size: 19px; margin-bottom: 15px; text-transform: uppercase;">Taller Práctico Finalizado</h2>
            <p class="desc-text" style="font-size: 13px; line-height: 1.6; color: #e2e8f0; margin-bottom: 20px;">
                La célula operativa ha completado de forma íntegra las cinco estaciones del simulador en el Parque 9 de Julio.
            </p>
            <div style="background: #030712; padding: 14px; border-radius: 6px; border: 1px solid #10b981; margin-bottom: 25px; font-size: 12px; color: #34d399;">
                <strong>CÉLULA EVALUADA:</strong> ${sesion.comisaria}<br>
                Oficial a Cargo: ${sesion.jefe}<br>
                Estado: <strong>Registrado y Transmitido a la Nube (Google Sheets)</strong>
            </div>
            <p style="color: #38bdf8; font-size: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                ⏳ Esperen la auditoría y devolución del cuerpo de instructores.
            </p>
        </div>
    `;
    transicionSec.classList.remove('hidden');
}

function volverDashboardDesdeTransicion() {
    let transicionSec = document.getElementById('transition-section');
    if(transicionSec) {
        transicionSec.classList.add('hidden');
    }
    document.getElementById('dashboard-section').classList.remove('hidden');
}

function volverDashboard() {
    document.getElementById('station-modal').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
}

// ==========================================
// MOTOR DE AUDITORÍA Y DICTAMEN TÉCNICO EXPERTO
// ==========================================
function actualizarMonitoreoEnVivo() {
    const tbody = document.getElementById('live-table-body');
    if(!tbody) return;

    if (GOOGLE_SCRIPT_URL) {
        fetch(GOOGLE_SCRIPT_URL + "?action=get_data", { method: "GET", mode: "cors" })
            .then(response => response.json())
            .then(data => procesarDatosAuditoriaJuridica(data))
            .catch(err => {
                console.log("Error leyendo nube, usando local:", err);
                procesarDatosLocalesAuditoria();
            });
    } else {
        procesarDatosLocalesAuditoria();
    }
}

function procesarDatosAuditoriaJuridica(registrosNube) {
    const tbody = document.getElementById('live-table-body');
    if(!tbody) return;
    tbody.innerHTML = "";
    
    let activasCount = 0;
    let finalizadosCount = 0;

    nominaDependencias.forEach((dep) => {
        let registrosDep = registrosNube.filter(r => r.comisaria === dep);
        let jefeStr = "Pendiente de Enlace";
        let modulosCompletados = [];
        let totalTrampas = 0;
        let totalAciertos = 0;

        if (registrosDep.length > 0) {
            activasCount++;
            jefeStr = registrosDep[registrosDep.length - 1].jefe || "Oficial";
            
            registrosDep.forEach(reg => {
                if(!modulosCompletados.includes(reg.modulo)) modulosCompletados.push(reg.modulo);
                let respArr = [];
                try {
                    respArr = typeof reg.respuestas === 'string' ? JSON.parse(reg.respuestas) : reg.respuestas;
                } catch(e) {}
                
                respArr.forEach(r => {
                    if(r.tipo === 'trampa') totalTrampas++;
                    if(r.tipo === 'acierto') totalAciertos++;
                });
            });

            if(modulosCompletados.length >= 5) finalizadosCount++;
        }

        let estadoLegalHTML = '<span style="color: #64748b;">Sin Actividad</span>';
        if(registrosDep.length > 0) {
            if (totalAciertos === 0 && totalTrampas === 0) {
                estadoLegalHTML = '<span style="color: #f59e0b; font-weight: bold;">⚠ Sin Datos</span>';
            } else if(totalTrampas === 0) {
                estadoLegalHTML = '<span style="color: #10b981; font-weight: bold;">✔ Riguroso</span>';
            } else if(totalTrampas <= 3) {
                estadoLegalHTML = '<span style="color: #f59e0b; font-weight: bold;">⚠ Desvíos</span>';
            } else {
                estadoLegalHTML = '<span style="color: #ef4444; font-weight: bold;">✖ Nulidad</span>';
            }
        }

        let tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid rgba(51, 65, 85, 0.4)";
        tr.innerHTML = `
            <td style="padding: 10px 6px; color: #f8fafc;">
                <strong>${dep.split('(')[0]}</strong><br>
                <small style="color: #94a3b8;">Jefe: ${jefeStr}</small>
            </td>
            <td style="padding: 10px 6px; text-align: center;">${modulosCompletados.length}/5</td>
            <td style="padding: 10px 6px; text-align: center; color: #38bdf8; font-weight: bold;">${totalAciertos}</td>
            <td style="padding: 10px 6px; text-align: center; color: #ef4444; font-weight: bold;">${totalTrampas}</td>
            <td style="padding: 10px 6px; text-align: center;">${estadoLegalHTML}</td>
            <td style="padding: 10px 6px; text-align: center;">
                <button class="btn-back-3d" style="margin: 0; padding: 5px 8px; font-size: 10px;" onclick='inspeccionarInformePericial(${JSON.stringify(registrosDep)}, "${dep}")'>Auditar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const statActivas = document.getElementById('stat-activas');
    const statFinalizados = document.getElementById('stat-finalizados');
    if(statActivas) statActivas.innerText = `${activasCount} / 15`;
    if(statFinalizados) statFinalizados.innerText = finalizadosCount;
}

function procesarDatosLocalesAuditoria() {
    const tbody = document.getElementById('live-table-body');
    if(!tbody) return;
    tbody.innerHTML = "";
    nominaDependencias.forEach((dep) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `<td style="padding:10px; color:#fff;">${dep.split('(')[0]}</td><td colspan="5" style="color:#94a3b8; text-align:center;">Modo local offline</td>`;
        tbody.appendChild(tr);
    });
}

function inspeccionarInformePericial(registros, nombreDep) {
    const box = document.getElementById('live-analysis-box');
    if(!box) return;

    if(!registros || registros.length === 0) {
        box.innerHTML = `
            <div style="background: rgba(15, 23, 42, 0.9); padding: 15px; border-radius: 8px; border: 1px solid #334155; text-align: center;">
                <strong style="color: #f59e0b; font-size: 13px;">CÉLULA SIN ACTIVIDAD</strong>
                <p style="margin-top: 5px; color: #94a3b8; font-size: 12px;">La dependencia <strong>${nombreDep}</strong> aún no ha registrado decisiones en terreno.</p>
            </div>`;
        return;
    }

    let jefe = registros[0].jefe || "Oficial a Cargo";
    let trampasTotales = 0;
    let aciertosTotales = 0;
    let bloquesHTML = "";

    registros.forEach(reg => {
        let respArr = [];
        try {
            respArr = typeof reg.respuestas === 'string' ? JSON.parse(reg.respuestas) : reg.respuestas;
        } catch(e) {}

        let aciertosModulo = respArr.filter(r => r.tipo === 'acierto').length;
        let trampasModulo = respArr.filter(r => r.tipo === 'trampa').length;

        aciertosTotales += aciertosModulo;
        trampasTotales += trampasModulo;

        let itemsDetalleHTML = "";
        if(respArr.length === 0) {
            itemsDetalleHTML = `<p style="color: #f59e0b; font-size: 11px; margin: 5px 0;">No se registraron selecciones en este bloque operativo.</p>`;
        } else {
            respArr.forEach(r => {
                let modNum = reg.modulo.replace(/[^0-9]/g, '');
                let infoMaestra = null;
                if(modulosData[modNum]) {
                    infoMaestra = modulosData[modNum].opciones.find(opt => opt.id === r.opcionId || opt.texto.trim() === r.texto.trim());
                }
                let fundacionTexto = infoMaestra ? infoMaestra.fundacion : "Evaluación conforme a los estándares del Código Procesal Penal.";

                if(r.tipo === 'trampa') {
                    itemsDetalleHTML += `
                        <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 8px; margin-bottom: 6px; border-radius: 4px;">
                            <span style="color: #ef4444; font-weight: bold; font-size: 11px; display: block;">✖ [TRAMPA PROCESAL ELEGIDA]: ${r.texto}</span>
                            <p style="color: #cbd5e1; font-size: 11px; margin: 4px 0 0 0; line-height: 1.4;"><strong>Fundamentación Jurídica (Docente/Abogado):</strong> ${fundacionTexto}</p>
                        </div>
                    `;
                } else {
                    itemsDetalleHTML += `
                        <div style="background: rgba(52, 211, 153, 0.1); border-left: 3px solid #34d399; padding: 8px; margin-bottom: 6px; border-radius: 4px;">
                            <span style="color: #34d399; font-weight: bold; font-size: 11px; display: block;">✔ [PAUTA DE ORO / ACIERTO]: ${r.texto}</span>
                            <p style="color: #cbd5e1; font-size: 11px; margin: 4px 0 0 0; line-height: 1.4;"><strong>Fundamentación Pericial:</strong> ${fundacionTexto}</p>
                        </div>
                    `;
                }
            });
        }

        bloquesHTML += `
            <div style="background: rgba(2, 6, 23, 0.6); padding: 12px; border-radius: 6px; border: 1px solid #334155; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 5px;">
                    <strong style="color: #38bdf8; font-size: 12px; text-transform: uppercase;">📌 ${reg.modulo}</strong>
                    <span style="font-size: 10px; color: #94a3b8;">${reg.fecha}</span>
                </div>
                ${itemsDetalleHTML}
            </div>
        `;
    });

    let badgeColor = "#10b981";
    let badgeBg = "rgba(16, 185, 129, 0.1)";
    let estadoTitulo = "PROCEDIMIENTO SÓLIDO (APTO PARA JUICIO)";
    let dictamenTexto = "La célula operativa ha demostrado un dominio excelente de las pautas de oro procesales y la preservación de la escena del crimen. El sumario resistirá de manera incólume cualquier planteo de nulidad o exclusión probatoria por parte de la defensa técnica.";

    if (aciertosTotales === 0 && trampasTotales === 0) {
        badgeColor = "#f59e0b";
        badgeBg = "rgba(245, 158, 11, 0.1)";
        estadoTitulo = "REGISTRO INCOMPLETO (SIN OPCIONES)";
        dictamenTexto = "No se registran opciones tildadas en los bloques enviados por esta dependencia.";
    } else if(trampasTotales > 0 && trampasTotales <= 3) {
        badgeColor = "#f59e0b";
        badgeBg = "rgba(245, 158, 11, 0.1)";
        estadoTitulo = "DESVÍOS FORMALES (REQUIERE CORRECCIÓN)";
        dictamenTexto = "Se detectaron tropiezos procedimentales menores y errores en la manipulación inicial. La defensa técnica planteará objeciones parciales en la etapa de debate.";
    } else if(trampasTotales > 3) {
        badgeColor = "#ef4444";
        badgeBg = "rgba(239, 68, 68, 0.1)";
        estadoTitulo = "RIESGO DE NULIDAD ABSOLUTA (CRÍTICO)";
        dictamenTexto = "¡DICTAMEN NEGATIVO! El equipo incurrió en múltiples trampas procesales graves (contaminación de escena, vulneración de garantías o vicios en actas). Alta probabilidad de nulidad absoluta.";
    }

    let html = `
        <div style="background: rgba(3, 7, 18, 0.95); padding: 15px; border-radius: 8px; border: 1px solid #334155; font-family: sans-serif;">
            <div style="border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 12px;">
                <h3 style="color: #38bdf8; font-size: 14px; margin: 0; text-transform: uppercase;">📋 Dictamen de Auditoría Pericial: ${nombreDep.split('(')[0]}</h3>
                <p style="color: #94a3b8; font-size: 11px; margin-top: 3px;">Oficial a Cargo: <strong>${jefe}</strong></p>
            </div>

            <div style="background: ${badgeBg}; border: 1px solid ${badgeColor}; padding: 12px; border-radius: 6px; margin-bottom: 14px; text-align: center;">
                <span style="color: ${badgeColor}; font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">⚖️ Veredicto Técnico-Legal: ${estadoTitulo}</span>
                <p style="color: #f8fafc; font-size: 11px; margin: 0; line-height: 1.5;">${dictamenTexto}</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; text-align: center;">
                <div style="background: rgba(52, 211, 153, 0.1); border: 1px solid #34d399; padding: 8px; border-radius: 6px;">
                    <span style="font-size: 10px; color: #34d399; text-transform: uppercase; display: block;">Total Aciertos</span>
                    <strong style="font-size: 16px; color: #34d399;">${aciertosTotales}</strong>
                </div>
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 8px; border-radius: 6px;">
                    <span style="font-size: 10px; color: #ef4444; text-transform: uppercase; display: block;">Total Errores/Trampas</span>
                    <strong style="font-size: 16px; color: #ef4444;">${trampasTotales}</strong>
                </div>
            </div>

            <strong style="color: #38bdf8; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 10px;">Análisis Detallado de Decisiones (Punto por Punto):</strong>
            ${bloquesHTML}
        </div>
    `;

    box.innerHTML = html;
}
