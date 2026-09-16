// INFORME JURÍDICO Y PERICIAL DIDÁCTICO Y VISUAL
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
    let resumenBloques = "";

    registros.forEach(reg => {
        let respArr = [];
        try {
            respArr = typeof reg.respuestas === 'string' ? JSON.parse(reg.respuestas) : reg.respuestas;
        } catch(e) {}

        let aciertosModulo = respArr.filter(r => r.tipo === 'acierto').length;
        let trampasModulo = respArr.filter(r => r.tipo === 'trampa').length;

        aciertosTotales += aciertosModulo;
        trampasTotales += trampasModulo;

        resumenBloques += `
            <div style="background: rgba(2, 6, 23, 0.5); padding: 10px; border-radius: 6px; border: 1px solid #334155; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <strong style="color: #38bdf8; font-size: 12px;">📌 ${reg.modulo}</strong>
                    <span style="font-size: 11px; color: #94a3b8;">${reg.fecha}</span>
                </div>
                <div style="font-size: 11px; color: #cbd5e1;">
                    <span style="color: #34d399; font-weight: bold;">✔ Aciertos: ${aciertosModulo}</span> | 
                    <span style="color: #ef4444; font-weight: bold;">✖ Errores/Trampas: ${trampasModulo}</span>
                </div>
            </div>
        `;
    });

    // Definición del estado legal didáctico
    let badgeColor = "#10b981";
    let badgeBg = "rgba(16, 185, 129, 0.1)";
    let estadoTitulo = "PROCEDIMIENTO SÓLIDO (APTO)";
    let dictamenTexto = "El grupo aplicó correctamente las pautas de oro procesales. La escena se preservó conforme a derecho y el sumario resistirá cualquier planteo de nulidad en tribunales.";

    if(trampasTotales > 0 && trampasTotales <= 2) {
        badgeColor = "#f59e0b";
        badgeBg = "rgba(245, 158, 11, 0.1)";
        estadoTitulo = "DESVÍOS MENORES (REQUIERE CORRECCIÓN)";
        dictamenTexto = "Se cometieron algunos tropiezos formales. La defensa técnica podría cuestionar detalles menores, pero el núcleo de la prueba se mantiene.";
    } else if(trampasTotales > 2) {
        badgeColor = "#ef4444";
        badgeBg = "rgba(239, 68, 68, 0.1)";
        estadoTitulo = "RIESGO DE NULIDAD ABSOLUTA (CRÍTICO)";
        dictamenTexto = "¡Atención instructores! El grupo cayó en múltiples trampas procesales (contaminación de escena o mala manipulación). Alta probabilidad de que la causa se caiga por exclusión probatoria.";
    }

    let html = `
        <div style="background: rgba(3, 7, 18, 0.95); padding: 15px; border-radius: 8px; border: 1px solid #334155; font-family: sans-serif;">
            <div style="border-bottom: 1px solid #334155; padding-bottom: 8px; margin-bottom: 10px;">
                <h3 style="color: #38bdf8; font-size: 14px; margin: 0; text-transform: uppercase;">📋 Auditoría: ${nombreDep.split('(')[0]}</h3>
                <p style="color: #94a3b8; font-size: 11px; margin-top: 3px;">Oficial a Cargo: <strong>${jefe}</strong></p>
            </div>

            <!-- TARJETA DE DICTAMEN EJECUTIVO -->
            <div style="background: ${badgeBg}; border: 1px solid ${badgeColor}; padding: 10px; border-radius: 6px; margin-bottom: 12px; text-align: center;">
                <span style="color: ${badgeColor}; font-size: 12px; font-weight: bold; display: block; margin-bottom: 3px;">⚖️ Veredicto Legal: ${estadoTitulo}</span>
                <p style="color: #f8fafc; font-size: 11px; margin: 0; line-height: 1.4;">${dictamenTexto}</p>
            </div>

            <!-- RESUMEN NUMÉRICO -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; text-align: center;">
                <div style="background: rgba(52, 211, 153, 0.1); border: 1px solid #34d399; padding: 8px; border-radius: 6px;">
                    <span style="font-size: 10px; color: #34d399; text-transform: uppercase; display: block;">Total Aciertos</span>
                    <strong style="font-size: 16px; color: #34d399;">${aciertosTotales}</strong>
                </div>
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; padding: 8px; border-radius: 6px;">
                    <span style="font-size: 10px; color: #ef4444; text-transform: uppercase; display: block;">Total Errores/Trampas</span>
                    <strong style="font-size: 16px; color: #ef4444;">${trampasTotales}</strong>
                </div>
            </div>

            <!-- DESGLOSE POR MÓDULO -->
            <strong style="color: #94a3b8; font-size: 10px; text-transform: uppercase; display: block; margin-bottom: 6px;">Desglose por Bloque Operativo:</strong>
            ${resumenBloques}
        </div>
    `;

    box.innerHTML = html;
}
