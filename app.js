let sesion = { comisaria: "", jefe: "", puntaje: 100, completados: [] };

// URL DE TU PROYECTO EN LA NUBE (GOOGLE APPS SCRIPT)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnDP7nyUK0ydxwRYpYIDITuWZecaFdFIAk5wW_1A5E9FCffEzxoBs5kPnEg5XuFD1E/exec";

// NÓMINA OFICIAL PURA - IES POLICIAL
const nominaDependencias = [
    "Comisaría Seccional 1ª (Aybar, Etchenique, Gerez, Ruiz)",
    "Comisaría Seccional 2ª (Suárez, Valdez, Dib, Las Heras Cabocota, Montero)",
    "Comisaría Seccional 3ª (Del Lugo F., Del Lugo G. [Ausente Med.], Ocaranza, Sotelo, Lazarte)",
    "Comisaría Seccional 4ª (Bareiro, Palomar, Villagra, Ruiz Lozano)",
    "Comisaría Seccional 5ª (Abregú, Medina, Rojas, Quiroga, Villalba)",
    "Comisaría Seccional 6ª (Carrizo, Gómez, Iramain, Ybarra, Coronel)",
    "Comisaría Seccional 7ª (Forales, Chávez, Juárez, Girvau, Fernández)",
    "Comisaría Seccional 8ª (Mercado, Brandán, Vizcarra, Aguirre, Carrillo)",
    "Comisaría Seccional 9ª (Argañaraz, Ávila, Bazán, Moreno)",
    "Comisaría Seccional 10ª (Gramajo, Pintos, Verón, Frias, Soria)",
    "Comisaría Seccional 11ª (Oliva, Salas, Díaz, Rodríguez, Zárate Medina)",
    "Comisaría Seccional 12ª (Juárez, Alabarce, Ruiz)",
    "Comisaría Seccional 13ª (Alvarado, Ruiz, Argañaraz Lescano, Sotelo, Quinteros)",
    "Comisaría Seccional 14ª (Galván, Ramos, Nieva, Luna, Páez Fernández)",
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

// BANCO DE OPCIONES CLASIFICADAS (TIPO = 'acierto' o 'trampa')
const modulosData = {
    1: {
        titulo: "Módulo 1: Arribo, Perímetro y Control de Masas",
        instruccion: "En base al despliegue en el Parque 9 de Julio, marque <u>todas</u> las pautas de acción obligatorias y descarte las trampas procesales:",
        opciones: [
            { id: '1_1', tipo: 'trampa', texto: "Ingresar de inmediato al habitáculo abriendo la puerta principal por el camino más directo para constatar signos vitales sin importar el trayecto." },
            { id: '1_2', tipo: 'acierto', texto: "Establecer y utilizar un único carril de acceso y egreso balizado para todo el personal interviniente, evitando contaminar la zona núcleo con nuevos rastros." },
            { id: '1_3', tipo: 'acierto', texto: "Disponer un doble anillo perimetral de seguridad con móviles y personal para contener el avance de curiosos y familiares hostiles sin ceder terreno." },
            { id: '1_4', tipo: 'trampa', texto: "Tomar declaraciones informales rápidas a los curiosos del tumulto para ganar tiempo antes de que se dispersen." },
            { id: '1_5', tipo: 'acierto', texto: "Inspeccionar visualmente el estado del arma de fuego y municiones sin modificar su posición ni tocarlas sin la intervención de peritos idóneos." },
            { id: '1_6', tipo: 'trampa', texto: "Recoger el arma y la vaina servida del suelo para resguardarlas en la dependencia ante el riesgo inminente de sustracción por parte de la muchedumbre." },
            { id: '1_7', tipo: 'acierto', texto: "Subordinar cada movimiento operativo a las disposiciones del Código Procesal Penal, delimitando las facultades de prevención frente a los actos de investigación." },
            { id: '1_8', tipo: 'trampa', texto: "Permitir que los medios de prensa crucen la cinta perimetral si prometen no pisar cerca del vehículo de la víctima." },
            { id: '1_9', tipo: 'acierto', texto: "Designar personal específico para el registro y control de ingreso vehicular y peatonal en el anillo externo del parque." },
            { id: '1_10', tipo: 'trampa', texto: "Permitir que los familiares ingresen a la zona núcleo si se comprometen a llorar en silencio sin tocar el cuerpo." },
            { id: '1_11', tipo: 'acierto', texto: "Mantener los estrobos y balizas de los móviles encendidos para señalizar la zona crítica y advertir el perímetro a distancia." },
            { id: '1_12', tipo: 'trampa', texto: "Desplazar los móviles policiales del perímetro para liberar la calle apenas se anuncie la llegada de la prensa y las autoridades." },
            { id: '1_13', tipo: 'acierto', texto: "Coordinar de manera sincronizada el ingreso seguro de la unidad sanitaria (SIEMPRE/107) asegurando un corredor biológico limpio que no altere indicios balísticos." },
            { id: '1_14', tipo: 'trampa', texto: "Permitir que los operadores sanitarios remuevan el vehículo o los cuerpos antes de la llegada de Criminalística si el tráfico del parque se congestiona." },
            { id: '1_15', tipo: 'acierto', texto: "Restringir el uso de teléfonos particulares a los efectivos dentro del anillo perimetral para evitar la filtración indebida de imágenes al exterior." },
            { id: '1_16', tipo: 'acierto', texto: "Habilitar un puesto de mando unificado en el perímetro externo para recibir directivas de la superioridad y articular con fiscales." }
        ]
    },
    2: {
        titulo: "Módulo 2: Investigación Activa y Testigos Dubitativos",
        instruccion: "Ante la información imperfecta y el entorno caótico, marque <u>todas</u> las medidas correctas de investigación de campo y gestión de testigos:",
        opciones: [
            { id: '2_1', tipo: 'acierto', texto: "Identificar selectivamente al testigo ocular real y aislarlo de inmediato del tumulto para evitar la contaminación cruzada de su memoria con los comentarios ajenos." },
            { id: '2_2', tipo: 'trampa', texto: "Dar por ciertas las afirmaciones de los transeúntes sobre la identidad de los autores y consignarlas como hechos probados y cerrados en el parte." },
            { id: '2_3', tipo: 'acierto', texto: "Registrar formalmente en notas de campo la distinción estricta entre los dichos referidos por terceros (subjetivo) y la constatación directa propia (objetivo)." },
            { id: '2_4', tipo: 'trampa', texto: "Tomar una declaración testimonial formal en la escena misma al testigo asustado para asegurar su relato antes de que se arrepienta." },
            { id: '2_5', tipo: 'acierto', texto: "Asegurar que el testigo retenido permanezca a disposición de las autoridades judiciales competentes sin inducir sus respuestas de manera sugestiva." },
            { id: '2_6', tipo: 'trampa', texto: "Descartar los comentarios de los vecinos y no indagar en el entorno para evitar perder tiempo en la prevención." },
            { id: '2_7', tipo: 'acierto', texto: "Indagar discretamente sobre posibles trayectorias de fuga aportadas por comerciantes o transeúntes ubicados en la periferia del parque." },
            { id: '2_8', tipo: 'trampa', texto: "Amenazar con detener al testigo dubitativo si no declara exactamente lo que los oficiales suponen que ocurrió." },
            { id: '2_9', tipo: 'acierto', texto: "Consultar al testigo sobre características físicas, indumentaria o dirección de huida de los sospechosos sin sugerir respuestas." },
            { id: '2_10', tipo: 'trampa', texto: "Formular preguntas capciosas o tendenciosas para orientar la memoria del testigo hacia un sospechoso conocido de la zona." },
            { id: '2_11', tipo: 'trampa', texto: "Inspeccionar los teléfonos celulares o dispositivos electrónicos hallados en la escena manipulando su pantalla y revisando mensajes sin orden judicial previa." },
            { id: '2_12', tipo: 'acierto', texto: "Asegurar los dispositivos electrónicos detectados sin manipular sus interfaces, disponiendo su aislamiento en bolsas faraday o apagándolos únicamente bajo directiva técnica." },
            { id: '2_13', tipo: 'trampa', texto: "Seleccionar como testigos instrumentales de actuación a personas vinculadas orgánicamente con la dependencia policial interviniente." },
            { id: '2_14', tipo: 'acierto', texto: "Documentar minuciosamente las contradicciones manifiestas entre los distintos relatos de los mirones para someterlas a posterior análisis pericial." },
            { id: '2_15', tipo: 'trampa', texto: "Obligar a los testigos presenciales a firmar actas pre-redactadas en la comisaría sin haber presenciado su confección en el lugar." },
            { id: '2_16', tipo: 'acierto', texto: "Verificar la existencia de cámaras de comercios aledaños entrevistando directamente a los encargados de seguridad privada." }
        ]
    },
    3: {
        titulo: "Módulo 3: Fijación de Condiciones y Espacio Gris",
        instruccion: "Para documentar con rigor absoluto el escenario imperfecto, marque <u>todas</u> las variables ambientales, temporales y tecnológicas obligatorias:",
        opciones: [
            { id: '3_1', tipo: 'acierto', texto: "Construir un registro minucioso de la visibilidad, condiciones climáticas e iluminación artificial o natural existente en el sector al momento del arribo." },
            { id: '3_2', tipo: 'trampa', texto: "Omitir los detalles del entorno lumínico por considerarlos datos menores que no hacen a la balística ni al resultado preliminar del hecho." },
            { id: '3_3', tipo: 'acierto', texto: "Relevar de inmediato la presencia de cámaras de seguridad públicas o privadas en las inmediaciones directas que hayan podido captar movimientos." },
            { id: '3_4', tipo: 'acierto', texto: "Anotar con precisión cronológica exacta los horarios de aviso, llegada del móvil y despliegue para evitar baches en el 'espacio gris' temporal." },
            { id: '3_5', tipo: 'trampa', texto: "Dejar asentado genéricamente que el parque estaba totalmente vacío para simplificar la redacción del acta preliminar." },
            { id: '3_6', tipo: 'trampa', texto: "Constatar dominios circundantes sin realizar constancias escritas si no hay un perito físico presente en ese instante." },
            { id: '3_7', tipo: 'acierto', texto: "Documentar la orientación cardinal exacta de la camioneta y la disposición de los accesos principales al Palacio de los Deportes." },
            { id: '3_8', tipo: 'trampa', texto: "Prescindir de registrar rastros de frenada, huellas de calzado o marcas en el suelo por considerarlas competencia exclusiva de los peritos viales." },
            { id: '3_9', tipo: 'acierto', texto: "Registrar la posición de elementos colindantes (cestos de basura, bancos, árboles) que delimiten geográficamente la escena." },
            { id: '3_10', tipo: 'trampa', texto: "Estimar los horarios de forma aproximada al finalizar la jornada laboral para no retrasar el papeleo administrativo." },
            { id: '3_11', tipo: 'trampa', texto: "Prescindir del relevamiento de fluidos biológicos o huellas latentes si las condiciones climáticas (humedad o calor) amenazan con degradarlas rápidamente." },
            { id: '3_12', tipo: 'acierto', texto: "Constatar dominios circundantes asegurando la trazabilidad de registros fílmicos mediante copias de seguridad resguardadas bajo cadena de custodia." },
            { id: '3_13', tipo: 'acierto', texto: "Describir pormenorizadamente el estado de los accesos viales perimetrales, calzadas y presencia de obstáculos físicos fijos o móviles." },
            { id: '3_14', tipo: 'trampa', texto: "Obviar la constatación de la temperatura ambiente y humedad bajo el pretexto de que no influyen en la labor preventiva inicial." },
            { id: '3_15', tipo: 'acierto', texto: "Registrar de manera rigurosa la secuencia de ingreso y egreso de cada funcionario público o perito que pisó la zona núcleo." },
            { id: '3_16', tipo: 'acierto', texto: "Consignar los números de internos o identificaciones de los móviles policiales que cerraron el primer anillo de contención." }
        ]
    },
    4: {
        titulo: "Módulo 4: Rigor Procesal y Trampas Sumariales",
        instruccion: "Para blindar el procedimiento ante los planteos de la defensa técnica en tribunales, marque <u>todas</u> las exigencias sumariales correctas:",
        opciones: [
            { id: '4_1', tipo: 'acierto', texto: "Subordinar cada medida a los límites procesales entre las facultades de prevención y los actos de investigación exclusivos de la fiscalía." },
            { id: '4_2', tipo: 'trampa', texto: "Avanzar en una carátula definitiva de homicidio por ajuste de cuentas en el acta inicial para demostrar eficacia investigativa." },
            { id: '4_3', tipo: 'acierto', texto: "Confeccionar el acta de prevención respetando la normativa legal e incluyendo la designación fehaciente de testigos hábiles de actuación." },
            { id: '4_4', tipo: 'acierto', texto: "Salvar formalmente de puño y letra cualquier enmienda, testadura o interlineado realizado durante la confección manuscrita de las actuaciones." },
            { id: '4_5', tipo: 'trampa', texto: "Dejar que el personal subalterno actúe por intuición sin supervisar las directivas legales impartidas en el lugar de los hechos." },
            { id: '4_6', tipo: 'trampa', texto: "Omitir la firma de los testigos instrumentales en el acta de procedimiento bajo el argumento de urgencia horaria." },
            { id: '4_7', tipo: 'acierto', texto: "Consignar de forma clara los datos identificatorios completos de los preventores intervinientes y la autoridad judicial informada." },
            { id: '4_8', tipo: 'trampa', texto: "Utilizar abreviaturas confusas, términos jeróglifos o lenguaje informal no técnico en la redacción de piezas procesales públicas." },
            { id: '4_9', tipo: 'acierto', texto: "Asegurar la intangibilidad del documento primario evitando alteraciones o agregados posteriores fuera de término legal." },
            { id: '4_10', tipo: 'trampa', texto: "Dejar el libro de actas sin cerrar ni rubricar al finalizar el procedimiento bajo custodia del preventor más moderno." },
            { id: '4_11', tipo: 'acierto', texto: "Transmitir a la fiscalía de turno un reporte preliminar objetivo y despojado de conjeturas subjetivas o hipótesis precipitadas sobre la autoría." },
            { id: '4_12', tipo: 'acierto', texto: "Garantizar la lectura íntegra del acta redactada a los intervinientes y testigos antes de proceder a la rúbrica formal del instrumento." },
            { id: '4_13', tipo: 'trampa', texto: "Dejar espacios en blanco o renglones libres al finalizar los párrafos principales del acta para facilitar agregados posteriores si fuera necesario." },
            { id: '4_14', tipo: 'acierto', texto: "Corroborar la coincidencia exacta entre los datos filiatorios asentados en los documentos de identidad y los plasmados en el sumario." },
            { id: '4_15', tipo: 'acierto', texto: "Remitir las actuaciones originales a la sede judicial dentro de los plazos legales perentorios establecidos por la normativa procesal vigente." },
            { id: '4_16', tipo: 'trampa', texto: "Delegar la redacción total del sumario a personal civil ajeno a la fuerza policial sin supervisión de oficial jefe." }
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

    if(sesion.completados.length === 4) {
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
            <h2 style="color: #38bdf8; font-size: 18px; margin-bottom: 15px; text-transform: uppercase;">Estación Registrada</h2>
            <p class="desc-text" style="font-size: 13px; color: #e2e8f0; margin-bottom: 20px;">Datos transmitidos con éxito a la central de comando docente.</p>
            <button type="button" class="btn-tactical-3d" onclick="volverDashboardDesdeTransicion()">🚀 Continuar Siguiente Bloque</button>
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
            <p class="desc-text" style="font-size: 13px; color: #e2e8f0; margin-bottom: 20px;">La célula ha completado los 4 bloques de intervención en el Parque 9 de Julio.</p>
        </div>
    `;
    transicionSec.classList.remove('hidden');
}

function volverDashboardDesdeTransicion() {
    let transicionSec = document.getElementById('transition-section');
    if(transicionSec) transicionSec.classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
}

function volverDashboard() {
    document.getElementById('station-modal').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
}

// ==========================================
// AUDITORÍA JURÍDICA PROFESIONAL PARA INSTRUCTORES
// ==========================================
function actualizarMonitoreoEnVivo() {
    const tbody = document.getElementById('live-table-body');
    if(!tbody) return;

    if (GOOGLE_SCRIPT_URL) {
        fetch(GOOGLE_SCRIPT_URL + "?action=get_data")
            .then(response => response.json())
            .then(data => procesarDatosAuditoriaJuridica(data))
            .catch(err => procesarDatosLocalesAuditoria());
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

            if(modulosCompletados.length >= 4) finalizadosCount++;
        }

        // Semáforo legal y pericial basado en los errores (trampas) cometidos
        let estadoLegalHTML = '<span style="color: #64748b;">Sin Actividad</span>';
        if(registrosDep.length > 0) {
            if(totalTrampas === 0) {
                estadoLegalHTML = '<span style="color: #10b981; font-weight: bold;">✔ Riguroso (Apto)</span>';
            } else if(totalTrampas <= 2) {
                estadoLegalHTML = '<span style="color: #f59e0b; font-weight: bold;">⚠ Desvíos Menores</span>';
            } else {
                estadoLegalHTML = '<span style="color: #ef4444; font-weight: bold;">✖ Nulidad Procesal (Riesgo)</span>';
            }
        }

        let tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid rgba(51, 65, 85, 0.4)";
        tr.innerHTML = `
            <td style="padding: 12px; color: #f8fafc;">
                <strong>${dep.split('(')[0]}</strong><br>
                <small style="color: #94a3b8;">Jefe: ${jefeStr}</small>
            </td>
            <td style="padding: 12px; text-align: center;">${modulosCompletados.length > 0 ? '✔' : '-'} (${modulosCompletados.length}/4)</td>
            <td style="padding: 12px; text-align: center; color: #38bdf8; font-weight: bold;">${totalAciertos}</td>
            <td style="padding: 12px; text-align: center; color: #ef4444; font-weight: bold;">${totalTrampas}</td>
            <td style="padding: 12px; text-align: center;">${estadoLegalHTML}</td>
            <td style="padding: 12px; text-align: center;">
                <button class="btn-back-3d" style="margin: 0; padding: 5px 10px; font-size: 10px;" onclick='inspeccionarInformePericial(${JSON.stringify(registrosDep)}, "${dep}")'>Inspeccionar</button>
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
    // Respaldo local si no hay red
    const tbody = document.getElementById('live-table-body');
    if(!tbody) return;
    tbody.innerHTML = "";
    nominaDependencias.forEach((dep) => {
        let datos = JSON.parse(localStorage.getItem('sesion_' + dep));
        let tr = document.createElement('tr');
        tr.innerHTML = `<td style="padding:12px; color:#fff;">${dep.split('(')[0]}</td><td colspan="5" style="color:#94a3b8; text-align:center;">Modo local sin conexión</td>`;
        tbody.appendChild(tr);
    });
}

// INFORME JURÍDICO Y PERICIAL PROFESIONAL PARA EL INSTRUCTOR
function inspeccionarInformePericial(registros, nombreDep) {
    const box = document.getElementById('live-analysis-box');
    if(!box) return;

    if(!registros || registros.length === 0) {
        box.innerHTML = `<strong style="color: #f59e0b;">INFORME DE AUDITORÍA: ${nombreDep}</strong><br><p style="margin-top: 5px; color: #94a3b8;">La célula operativa aún no ha registrado intervenciones en la escena.</p>`;
        return;
    }

    let jefe = registros[0].jefe || "Oficial a Cargo";
    let trampasTotales = 0;
    let aciertosTotales = 0;
    let detalleHTML = "";

    registros.forEach(reg => {
        let respArr = [];
        try {
            respArr = typeof reg.respuestas === 'string' ? JSON.parse(reg.respuestas) : reg.respuestas;
        } catch(e) {}

        detalleHTML += `<div style="margin-top: 10px; border-left: 3px solid #0284c7; padding-left: 10px;">`;
        detalleHTML += `<strong style="color: #38bdf8;">${reg.modulo}</strong> <small style="color: #94a3b8;">(${reg.fecha})</small>`;
        
        if(respArr.length === 0) {
            detalleHTML += `<p style="color: #f59e0b; font-size: 11px;">Sin decisiones tildadas en este bloque.</p>`;
        } else {
            detalleHTML += `<ul style="margin: 4px 0 0 15px; font-size: 11px; color: #e2e8f0;">`;
            respArr.forEach(r => {
                if(r.tipo === 'trampa') {
                    trampasTotales++;
                    detalleHTML += `<li style="color: #ef4444;">✖ <strong>[TRAMPA PROCESAL / RIESGO DE NULIDAD]:</strong> ${r.texto}</li>`;
                } else {
                    aciertosTotales++;
                    detalleHTML += `<li style="color: #34d399;">✔ <strong>[PAUTA DE ORO / ACIERTO]:</strong> ${r.texto}</li>`;
                }
            });
            detalleHTML += `</ul>`;
        }
        detalleHTML += `</div>`;
    });

    // Veredicto del Instructor / Abogado Penalista
    let veredictoColor = "#10b981";
    let veredictoTexto = "Actuación sólida, respetuosa de la cadena de custodia y de las garantías constitucionales. Apta para sostener la acusación en juicio.";
    if(trampasTotales > 0 && trampasTotales <= 2) {
        veredictoColor = "#f59e0b";
        veredictoTexto = "Se detectaron desvíos formales y errores en la manipulación. La defensa técnica podrá plantear objeciones parciales sobre las actas.";
    } else if(trampasTotales > 2) {
        veredictoColor = "#ef4444";
        veredictoTexto = "¡CRÍTICO! Violación grave de normas procesales y periciales. Alto riesgo de nulidad absoluta de la instrucción y planteo de exclusión probatoria por parte de la defensa.";
    }

    let html = `<div style="background: rgba(2, 6, 23, 0.8); padding: 15px; border-radius: 8px; border: 1px solid #334155;">`;
    html += `<h3 style="color: #38bdf8; font-size: 14px; margin-bottom: 5px; text-transform: uppercase;">📋 Dictamen Pericial y Sumarial: ${nombreDep}</h3>`;
    html += `<p style="color: #cbd5e1; font-size: 12px; margin-bottom: 8px;"><strong>Oficial a Cargo:</strong> ${jefe} | <strong>Aciertos:</strong> <span style="color:#34d399;">${aciertosTotales}</span> | <strong>Trampas/Errores:</strong> <span style="color:#ef4444;">${trampasTotales}</span></p>`;
    html += `<div style="background: rgba(15, 23, 42, 0.9); padding: 10px; border-radius: 6px; border: 1px solid ${veredictoColor}; margin-bottom: 10px;">`;
    html += `<strong style="color: ${veredictoColor}; font-size: 12px; text-transform: uppercase;">⚖️ Veredicto Técnico-Legal:</strong><br>`;
    html += `<p style="color: #f8fafc; font-size: 12px; margin-top: 4px;">${veredictoTexto}</p>`;
    html += `</div>`;
    html += `<strong style="color: #94a3b8; font-size: 11px; text-transform: uppercase;">Desglose analítico por estación:</strong>`;
    html += detalleHTML;
    html += `</div>`;

    box.innerHTML = html;
}
