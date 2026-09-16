let sesion = { comisaria: "", jefe: "", puntaje: 100, completados: [] };

// URL DE TU PROYECTO EN LA NUBE (GOOGLE APPS SCRIPT)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnDP7nyUK0ydxwRYpYIDITuWZecaFdFIAk5wW_1A5E9FCffEzxoBs5kPnEg5XuFD1E/exec";

// NÓMINA OFICIAL PURA - IES POLICIAL (CONFORME DOCUMENTO ACADÉMICO)
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
    // 1. SI ESTAMOS EN LA VISTA DE CADETE (LOGIN)
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
                    sirena.play().catch(err => console.log("Audio bloqueado por navegador:", err));
                }

                document.getElementById('login-section').classList.add('hidden');
                document.getElementById('dashboard-section').classList.remove('hidden');

                document.getElementById('display-comisaria').innerText = sesion.comisaria;
                document.getElementById('display-jefe').innerText = sesion.jefe;
            });
        }
    }

    // 2. SI ESTAMOS EN LA VISTA DEL INSTRUCTOR (CENTRO DE MONITOREO EN VIVO)
    const liveTableBody = document.getElementById('live-table-body');
    if(liveTableBody) {
        actualizarMonitoreoEnVivo();
        setInterval(actualizarMonitoreoEnVivo, 3000); // Refresco automático cada 3s
    }

    // Efecto de audio táctico global al tildar opciones
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

// BANCO MASIVO EXTENDIDO (15+ OPCIONES DE ÚLTIMA GENERACIÓN POR CADA MÓDULO)
const modulosData = {
    1: {
        titulo: "Módulo 1: Arribo, Perímetro y Control de Masas",
        instruccion: "En base al despliegue en el Parque 9 de Julio, la muchedumbre hostil y la escena crítica, marque <u>todas</u> las pautas de acción obligatorias y descarte las trampas procesales:",
        opciones: [
            { id: '1_1', texto: "Ingresar de inmediato al habitáculo abriendo la puerta principal por el camino más directo para constatar signos vitales sin importar el trayecto." },
            { id: '1_2', texto: "Establecer y utilizar un único carril de acceso y egreso balizado para todo el personal interviniente, evitando contaminar la zona núcleo con nuevos rastros." },
            { id: '1_3', texto: "Disponer un doble anillo perimetral de seguridad con móviles y personal para contener el avance de curiosos y familiares hostiles sin ceder terreno." },
            { id: '1_4', texto: "Tomar declaraciones informales rápidas a los curiosos del tumulto para ganar tiempo antes de que se dispersen." },
            { id: '1_5', texto: "Inspeccionar visualmente el estado del arma de fuego y municiones sin modificar su posición ni tocarlas sin la intervención de peritos idóneos." },
            { id: '1_6', texto: "Recoger el arma y la vaina servida del suelo para resguardarlas en la dependencia ante el riesgo inminente de sustracción por parte de la muchedumbre." },
            { id: '1_7', texto: "Subordinar cada movimiento operativo a las disposiciones del Código Procesal Penal, delimitando las facultades de prevención frente a los actos de investigación." },
            { id: '1_8', texto: "Permitir que los medios de prensa crucen la cinta perimetral si prometen no pisar cerca del vehículo de la víctima." },
            { id: '1_9', texto: "Designar personal específico para el registro y control de ingreso vehicular y peatonal en el anillo externo del parque." },
            { id: '1_10', texto: "Permitir que los familiares ingresen a la zona núcleo si se comprometen a llorar en silencio sin tocar el cuerpo." },
            { id: '1_11', texto: "Mantener los estrobos y balizas de los móviles encendidos para señalizar la zona crítica y advertir el perímetro a distancia." },
            { id: '1_12', texto: "Desplazar los móviles policiales del perímetro para liberar la calle apenas se anuncie la llegada de la prensa y las autoridades." },
            { id: '1_13', texto: "Coordinar de manera sincronizada el ingreso seguro de la unidad sanitaria (SIEMPRE/107) asegurando un corredor biológico limpio que no altere indicios balísticos." },
            { id: '1_14', texto: "Permitir que los operadores sanitarios remuevan el vehículo o los cuerpos antes de la llegada de Criminalística si el tráfico del parque se congestiona." },
            { id: '1_15', texto: "Restringir el uso de teléfonos particulares a los efectivos dentro del anillo perimetral para evitar la filtración indebida de imágenes al exterior." },
            { id: '1_16', texto: "Habilitar un puesto de mando unificado en el perímetro externo para recibir directivas de la superioridad y articular con fiscales." }
        ]
    },
    2: {
        titulo: "Módulo 2: Investigación Activa y Testigos Dubitativos",
        instruccion: "Ante la información imperfecta y el entorno caótico, marque <u>todas</u> las medidas correctas de investigación de campo y gestión de testigos:",
        opciones: [
            { id: '2_1', texto: "Identificar selectivamente al testigo ocular real y aislarlo de inmediato del tumulto para evitar la contaminación cruzada de su memoria con los comentarios ajenos." },
            { id: '2_2', texto: "Dar por ciertas las afirmaciones de los transeúntes sobre la identidad de los autores y consignarlas como hechos probados y cerrados en el parte." },
            { id: '2_3', texto: "Registrar formalmente en notas de campo la distinción estricta entre los dichos referidos por terceros (subjetivo) y la constatación directa propia (objetivo)." },
            { id: '2_4', texto: "Tomar una declaración testimonial formal en la escena misma al testigo asustado para asegurar su relato antes de que se arrepienta." },
            { id: '2_5', texto: "Asegurar que el testigo retenido permanezca a disposición de las autoridades judiciales competentes sin inducir sus respuestas de manera sugestiva." },
            { id: '2_6', texto: "Descartar los comentarios de los vecinos y no indagar en el entorno para evitar perder tiempo en la prevención." },
            { id: '2_7', texto: "Indagar discretamente sobre posibles trayectorias de fuga aportadas por comerciantes o transeúntes ubicados en la periferia del parque." },
            { id: '2_8', texto: "Amenazar con detener al testigo dubitativo si no declara exactamente lo que los oficiales suponen que ocurrió." },
            { id: '2_9', texto: "Consultar al testigo sobre características físicas, indumentaria o dirección de huida de los sospechosos sin sugerir respuestas." },
            { id: '2_10', texto: "Formular preguntas capciosas o tendenciosas para orientar la memoria del testigo hacia un sospechoso conocido de la zona." },
            { id: '2_11', texto: "Inspeccionar los teléfonos celulares o dispositivos electrónicos hallados en la escena manipulando su pantalla y revisando mensajes sin orden judicial previa." },
            { id: '2_12', texto: "Asegurar los dispositivos electrónicos detectados sin manipular sus interfaces, disponiendo su aislamiento en bolsas faraday o apagándolos únicamente bajo directiva técnica." },
            { id: '2_13', texto: "Seleccionar como testigos instrumentales de actuación a personas vinculadas orgánicamente con la dependencia policial interviniente." },
            { id: '2_14', texto: "Documentar minuciosamente las contradicciones manifiestas entre los distintos relatos de los mirones para someterlas a posterior análisis pericial." },
            { id: '2_15', texto: "Obligar a los testigos presenciales a firmar actas pre-redactadas en la comisaría sin haber presenciado su confección en el lugar." },
            { id: '2_16', texto: "Verificar la existencia de cámaras de comercios aledaños entrevistando directamente a los encargados de seguridad privada." }
        ]
    },
    3: {
        titulo: "Módulo 3: Fijación de Condiciones y Espacio Gris",
        instruccion: "Para documentar con rigor absoluto el escenario imperfecto, marque <u>todas</u> las variables ambientales, temporales y tecnológicas obligatorias:",
        opciones: [
            { id: '3_1', texto: "Construir un registro minucioso de la visibilidad, condiciones climáticas e iluminación artificial o natural existente en el sector al momento del arribo." },
            { id: '3_2', texto: "Omitir los detalles del entorno lumínico por considerarlos datos menores que no hacen a la balística ni al resultado preliminar del hecho." },
            { id: '3_3', texto: "Relevar de inmediato la presencia de cámaras de seguridad públicas o privadas en las inmediaciones directas que hayan podido captar movimientos." },
            { id: '3_4', texto: "Anotar con precisión cronológica exacta los horarios de aviso, llegada del móvil y despliegue para evitar baches en el 'espacio gris' temporal." },
            { id: '3_5', texto: "Dejar asentado genéricamente que el parque estaba totalmente vacío para simplificar la redacción del acta preliminar." },
            { id: '3_6', texto: "Constatar dominios circundantes sin realizar constancias escritas si no hay un perito físico presente en ese instante." },
            { id: '3_7', texto: "Documentar la orientación cardinal exacta de la camioneta y la disposición de los accesos principales al Palacio de los Deportes." },
            { id: '3_8', texto: "Prescindir de registrar rastros de frenada, huellas de calzado o marcas en el suelo por considerarlas competencia exclusiva de los peritos viales." },
            { id: '3_9', texto: "Registrar la posición de elementos colindantes (cestos de basura, bancos, árboles) que delimiten geográficamente la escena." },
            { id: '3_10', texto: "Estimar los horarios de forma aproximada al finalizar la jornada laboral para no retrasar el papeleo administrativo." },
            { id: '3_11', texto: "Prescindir del relevamiento de fluidos biológicos o huellas latentes si las condiciones climáticas (humedad o calor) amenazan con degradarlas rápidamente." },
            { id: '3_12', texto: "Constatar dominios circundantes asegurando la trazabilidad de registros fílmicos mediante copias de seguridad resguardadas bajo cadena de custodia." },
            { id: '3_13', texto: "Describir pormenorizadamente el estado de los accesos viales perimetrales, calzadas y presencia de obstáculos físicos fijos o móviles." },
            { id: '3_14', texto: "Obviar la constatación de la temperatura ambiente y humedad bajo el pretexto de que no influyen en la labor preventiva inicial." },
            { id: '3_15', texto: "Registrar de manera rigurosa la secuencia de ingreso y egreso de cada funcionario público o perito que pisó la zona núcleo." },
            { id: '3_16', texto: "Consignar los números de internos o identificaciones de los móviles policiales que cerraron el primer anillo de contención." }
        ]
    },
    4: {
        titulo: "Módulo 4: Rigor Procesal y Trampas Sumariales",
        instruccion: "Para blindar el procedimiento ante los planteos de la defensa técnica en tribunales, marque <u>todas</u> las exigencias sumariales correctas:",
        opciones: [
            { id: '4_1', texto: "Subordinar cada medida a los límites procesales entre las facultades de prevención y los actos de investigación exclusivos de la fiscalía." },
            { id: '4_2', texto: "Avanzar en una carátula definitiva de homicidio por ajuste de cuentas en el acta inicial para demostrar eficacia investigativa." },
            { id: '4_3', texto: "Confeccionar el acta de prevención respetando la normativa legal e incluyendo la designación fehaciente de testigos hábiles de actuación." },
            { id: '4_4', texto: "Salvar formalmente de puño y letra cualquier enmienda, testadura o interlineado realizado durante la confección manuscrita de las actuaciones." },
            { id: '4_5', texto: "Dejar que el personal subalterno actúe por intuición sin supervisar las directivas legales impartidas en el lugar de los hechos." },
            { id: '4_6', texto: "Omitir la firma de los testigos instrumentales en el acta de procedimiento bajo el argumento de urgencia horaria." },
            { id: '4_7', texto: "Consignar de forma clara los datos identificatorios completos de los preventores intervinientes y la autoridad judicial informada." },
            { id: '4_8', texto: "Utilizar abreviaturas confusas, términos jeróglifos o lenguaje informal no técnico en la redacción de piezas procesales públicas." },
            { id: '4_9', texto: "Asegurar la intangibilidad del documento primario evitando alteraciones o agregados posteriores fuera de término legal." },
            { id: '4_10', texto: "Dejar el libro de actas sin cerrar ni rubricar al finalizar el procedimiento bajo custodia del preventor más moderno." },
            { id: '4_11', texto: "Transmitir a la fiscalía de turno un reporte preliminar objetivo y despojado de conjeturas subjetivas o hipótesis precipitadas sobre la autoría." },
            { id: '4_12', texto: "Garantizar la lectura íntegra del acta redactada a los intervinientes y testigos antes de proceder a la rúbrica formal del instrumento." },
            { id: '4_13', texto: "Dejar espacios en blanco o renglones libres al finalizar los párrafos principales del acta para facilitar agregados posteriores si fuera necesario." },
            { id: '4_14', texto: "Corroborar la coincidencia exacta entre los datos filiatorios asentados en los documentos de identidad y los plasmados en el sumario." },
            { id: '4_15', texto: "Remitir las actuaciones originales a la sede judicial dentro de los plazos legales perentorios establecidos por la normativa procesal vigente." },
            { id: '4_16', texto: "Delegar la redacción total del sumario a personal civil ajeno a la fuerza policial sin supervisión de oficial jefe." }
        ]
    }
};

// FUNCIONES DE NAVEGACIÓN Y EVALUACIÓN DE CADETES
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
        html += `<label class="checkbox-label">
            <input type="checkbox" name="eval_op" value="${op.id}"> ${op.texto}
        </label>`;
    });
    html += `<button type="button" class="btn-tactical-3d" onclick="evaluarModulo(${id})">Registrar Decisiones del Bloque</button></form>`;
    html += `<div id="feedback-container"></div>`;

    document.getElementById('mod-body').innerHTML = html;
}

function evaluarModulo(modId) {
    const checkboxes = document.querySelectorAll('input[name="eval_op"]:checked');
    let respuestasModulo = [];
    checkboxes.forEach(cb => {
        respuestasModulo.push({
            opcionId: cb.value,
            texto: cb.parentElement.innerText.trim()
        });
    });

    // 1. Guardado local de respaldo
    let sesionGuardada = JSON.parse(localStorage.getItem('sesion_' + sesion.comisaria)) || { comisaria: sesion.comisaria, jefe: sesion.jefe, completados: [], respuestas: [] };
    sesionGuardada.jefe = sesion.jefe;
    if(!sesionGuardada.completados.includes(modId)) {
        sesionGuardada.completados.push(modId);
    }
    sesionGuardada.respuestas = sesionGuardada.respuestas.filter(r => r.modulo !== modId).concat(respuestasModulo.map(r => ({modulo: modId, ...r})));
    localStorage.setItem('sesion_' + sesion.comisaria, JSON.stringify(sesionGuardada));

    // 2. ENVÍO ONLINE A LA NUBE (GOOGLE SHEETS)
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
        }).catch(err => console.log("Error de transmisión a la nube:", err));
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
            <h2 style="color: #38bdf8; font-size: 18px; margin-bottom: 15px; text-transform: uppercase;">Escena del hecho evaluada</h2>
            <p class="desc-text" style="font-size: 13px; line-height: 1.6; color: #e2e8f0; margin-bottom: 20px;">
                El equipo ha terminado de evaluar este bloque de la escena del crimen.
            </p>
            <div style="background: #030712; padding: 12px; border-radius: 6px; border: 1px solid #0284c7; margin-bottom: 20px; font-size: 12px; color: #38bdf8;">
                <strong>CÉLULA OPERATIVA:</strong> ${sesion.comisaria}<br>
                Oficial a Cargo: ${sesion.jefe}
            </div>
            <p style="color: #10b981; font-size: 14px; font-weight: bold; margin-bottom: 25px; text-transform: uppercase;">
                ➔ Pasar al siguiente bloque. Debe seleccionar el bloque que siga.
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
            <h2 style="color: #10b981; font-size: 19px; margin-bottom: 15px; text-transform: uppercase;">Taller práctico en la escena de un crimen finalizado</h2>
            <p class="desc-text" style="font-size: 13px; line-height: 1.6; color: #e2e8f0; margin-bottom: 20px;">
                La célula operativa ha completado de forma íntegra los cuatro bloques de intervención pericial y sumarial en el Parque 9 de Julio.
            </p>
            <div style="background: #030712; padding: 14px; border-radius: 6px; border: 1px solid #10b981; margin-bottom: 25px; font-size: 12px; color: #34d399;">
                <strong>CÉLULA EVALUADA:</strong> ${sesion.comisaria}<br>
                Oficial a Cargo: ${sesion.jefe}<br>
                Estado: <strong>Registrado y Transmitido a la Nube (Google Sheets)</strong>
            </div>
            <p style="color: #38bdf8; font-size: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                ⏳ Esperen una devolución de los instructores.
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

// FUNCIONES DE MONITOREO EN VIVO PARA EL PANEL DE INSTRUCTORES
function actualizarMonitoreoEnVivo() {
    const tbody = document.getElementById('live-table-body');
    if(!tbody) return;

    tbody.innerHTML = "";
    let activasCount = 0;
    let finalizadosCount = 0;

    nominaDependencias.forEach((dep) => {
        let datosSesion = JSON.parse(localStorage.getItem('sesion_' + dep)) || null;

        let estadoB1 = '<span style="color: #64748b;">Sin Iniciar</span>';
        let estadoB2 = '<span style="color: #64748b;">-</span>';
        let estadoB3 = '<span style="color: #64748b;">-</span>';
        let estadoB4 = '<span style="color: #64748b;">-</span>';
        let jefeStr = "Pendiente de Enlace";

        if (datosSesion) {
            activasCount++;
            jefeStr = datosSesion.jefe;
            if(datosSesion.completados.includes(1)) estadoB1 = '<span style="color: #34d399;">✔ Óptimo</span>';
            if(datosSesion.completados.includes(2)) estadoB2 = '<span style="color: #34d399;">✔ Óptimo</span>';
            if(datosSesion.completados.includes(3)) estadoB3 = '<span style="color: #34d399;">✔ Óptimo</span>';
            if(datosSesion.completados.includes(4)) {
                estadoB4 = '<span style="color: #34d399;">✔ Finalizado</span>';
                finalizadosCount++;
            } else if(datosSesion.completados.length > 0) {
                estadoB4 = '<span style="color: #f59e0b;">En Proceso</span>';
            }
        }

        let tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid rgba(51, 65, 85, 0.4)";
        
        tr.innerHTML = `
            <td style="padding: 12px; color: #f8fafc;">
                <strong>${dep.split('(')[0]}</strong><br>
                <small style="color: #94a3b8;">Jefe: ${jefeStr}</small>
            </td>
            <td style="padding: 12px; text-align: center;">${estadoB1}</td>
            <td style="padding: 12px; text-align: center;">${estadoB2}</td>
            <td style="padding: 12px; text-align: center;">${estadoB3}</td>
            <td style="padding: 12px; text-align: center;">${estadoB4}</td>
            <td style="padding: 12px; text-align: center;">
                <button class="btn-back-3d" style="margin: 0; padding: 5px 10px; font-size: 10px;" onclick='inspeccionarDetalle(${JSON.stringify(datosSesion)}, "${dep}")'>Inspeccionar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const statActivas = document.getElementById('stat-activas');
    const statFinalizados = document.getElementById('stat-finalizados');
    if(statActivas) statActivas.innerText = `${activasCount} / 15`;
    if(statFinalizados) statFinalizados.innerText = finalizadosCount;
}

function inspeccionarDetalle(datos, nombreDep) {
    const box = document.getElementById('live-analysis-box');
    if(!box) return;

    if(!datos) {
        box.innerHTML = `<strong style="color: #f59e0b;">CÉLULA SIN ACTIVIDAD:</strong> ${nombreDep}<br><p style="margin-top: 5px; color: #94a3b8;">Este grupo aún no ha establecido enlace ni ha iniciado sesión en el simulador de campo.</p>`;
        return;
    }

    let html = `<strong style="color: #38bdf8;">AUDITORÍA EN VIVO: ${nombreDep}</strong><br>`;
    html += `<p style="margin-top: 4px; color: #cbd5e1;"><strong>Oficial a Cargo:</strong> ${datos.jefe}</p>`;
    html += `<p style="margin-top: 4px; color: #34d399;"><strong>Bloques Completados:</strong> ${datos.completados.length} de 4 estaciones.</p>`;
    
    if(datos.respuestas && datos.respuestas.length > 0) {
        html += `<p style="margin-top: 6px; color: #38bdf8;"><strong>Opciones y Decisiones Registradas por los Cadetes:</strong></p><ul style="margin-left: 15px; font-size: 11px; color: #e2e8f0; margin-top: 4px;">`;
        datos.respuestas.forEach(r => {
            html += `<li>[Bloque ${r.modulo}] Ítem ID: <code>${r.opcionId}</code> - Texto: ${r.texto}</li>`;
        });
        html += `</ul>`;
    } else {
        html += `<p style="margin-top: 6px; color: #94a3b8;">El grupo está operando en los bloques pero aún no ha registrado el envío final de las opciones seleccionadas.</p>`;
    }

    box.innerHTML = html;
}