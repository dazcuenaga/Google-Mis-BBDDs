// Datos del módulo "Esquema Cabaña" (categoría Infraestructura): no lee ninguna
// hoja — son tres fichas fijas con el plano de situación de la cabaña, la tabla
// de volúmenes de hormigón y la tabla de materiales y costes, copiadas del
// lienzo de diseño original. Usa la misma pantalla de fichas de texto que el
// módulo Guías (`custom: 'guias'`, entradas con `html`; ver guias-data.js y
// openGuiaImagen en app.js), así que no necesita navegación propia.
//
// El plano es el HTML original del lienzo (todo posicionado en píxeles sobre un
// área de 1711 × 1262): app.js lo escala al ancho de la pantalla y se amplía al
// tocarlo (ver initPlano en app.js). Los números en círculo rojo del plano son
// los Id. de la tabla de volúmenes.

const CABANA_PLANO_HTML = `
<div class="guia-plano" data-w="1711" data-h="1262"><div class="guia-plano-inner">
<div style="position: relative; width: 1711px; height: 1262px; background: #F5F2EA; font-family: 'IBM Plex Sans', sans-serif; color: #2B2A26; overflow: hidden">

<div style="position: absolute; left: 40px; top: 26px; font-size: 34px; font-weight: 600; letter-spacing: -0.01em">Cabaña · plano de situación</div>
<div style="position: absolute; left: 40px; top: 72px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: #6A675E">Medidas aproximadas</div>

<div style="position: absolute; left: 43px; top: 106px; width: 1623px; height: 989px; background: #DCE4CF; outline: 2px solid #6B7A58; outline-offset: -2px">

<div style="position: absolute; left: 200px; top: 0; width: 1px; height: 1000px; background: #C3CDB3"></div>
<div style="position: absolute; left: 400px; top: 0; width: 1px; height: 1000px; background: #C3CDB3"></div>
<div style="position: absolute; left: 600px; top: 0; width: 1px; height: 1000px; background: #C3CDB3"></div>
<div style="position: absolute; left: 800px; top: 0; width: 1px; height: 1000px; background: #C3CDB3"></div>
<div style="position: absolute; left: 1000px; top: 0; width: 1px; height: 1000px; background: #C3CDB3"></div>
<div style="position: absolute; left: 1200px; top: 0; width: 1px; height: 1000px; background: #C3CDB3"></div>
<div style="position: absolute; left: 0; top: 200px; width: 1700px; height: 1px; background: #C3CDB3"></div>
<div style="position: absolute; left: 0; top: 400px; width: 1700px; height: 1px; background: #C3CDB3"></div>
<div style="position: absolute; left: 0; top: 600px; width: 1700px; height: 1px; background: #C3CDB3"></div>
<div style="position: absolute; left: 0; top: 800px; width: 1700px; height: 1px; background: #C3CDB3"></div>
<div style="position: absolute; left: 1400px; top: 0; width: 1px; height: 1000px; background: #C3CDB3"></div>
<div style="position: absolute; left: 1600px; top: 0; width: 1px; height: 1000px; background: #C3CDB3"></div>
<div style="position: absolute; left: 1404px; top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #7E8A6C">35 m</div>
<div style="position: absolute; left: 1604px; top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #7E8A6C">40 m</div>

<div style="position: absolute; left: 204px; top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #7E8A6C">5 m</div>
<div style="position: absolute; left: 404px; top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #7E8A6C">10 m</div>
<div style="position: absolute; left: 604px; top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #7E8A6C">15 m</div>
<div style="position: absolute; left: 804px; top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #7E8A6C">20 m</div>
<div style="position: absolute; left: 1004px; top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #7E8A6C">25 m</div>
<div style="position: absolute; left: 1204px; top: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #7E8A6C">30 m</div>

<div style="position: absolute; left: 386px; top: 400px; width: 34px; height: 313.3px; background: #CBC7BA"></div>
<div style="position: absolute; left: 980px; top: 300px; width: 34px; height: 413.3px; background: #CBC7BA"></div>
<div style="position: absolute; left: 940px; top: 300px; width: 40px; height: 100px; background: #CBC7BA"></div>
<div style="position: absolute; left: 386px; top: 624px; width: 628px; height: 89.3px; background: #CBC7BA"></div>
<div style="position: absolute; left: 430px; top: 690px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #6A675E">acera</div>

<div style="position: absolute; left: 1014px; top: 300px; width: 545px; height: 373.5px; background: #9FA8B0; clip-path: polygon(0px 0px, 371.55px 0px, 524.35px 264.62px, 493.27px 281.67px, 461.46px 297.36px, 429px 311.64px, 395.96px 324.5px, 362.39px 335.89px, 328.34px 345.81px, 293.9px 354.23px, 259.12px 361.15px, 224.08px 366.55px, 188.83px 370.41px, 153.45px 372.73px, 118px 373.5px, 0px 373.5px)"></div>
<div style="position: absolute; left: 1120px; top: 470px; font-size: 13px; font-weight: 600; color: #20272D">Placa de hormigón</div>
<div style="position: absolute; left: 1120px; top: 490px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #20272D">paralela a la valla, a 2,6 m</div>

<div style="position: absolute; left: 1014px; top: 673.5px; width: 117px; height: 102.5px; background: #9FA8B0; clip-path: polygon(0px 0px, 57px 0px, 116.2px 102.5px, 36.2px 102.5px, 0px 39.8px)"></div>
<div style="position: absolute; left: 1051.9px; top: 779px; width: 140px; height: 102.5px; background: #F6B97A; clip-path: polygon(0px 0px, 80px 0px, 139.2px 102.5px, 59.2px 102.5px)"></div>
<div style="position: absolute; left: 1109px; top: 818px; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #D32F2F; color: #D32F2F; font-size: 14px; font-weight: 700; line-height: 20px; text-align: center">1</div>
<div style="position: absolute; left: 1090px; top: 892px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #20272D">placa de hormigón · 30° · 2 m</div>

<div style="position: absolute; left: 212px; top: 400px; width: 144px; height: 232px; background: #9FA8B0; border: 2px solid #5F6B75; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px">
<div style="font-size: 13px; font-weight: 600; color: #20272D">Placa de hormigón</div>
<div style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #20272D">3,6 × 5,8 m</div>
</div>

<div style="position: absolute; left: 356px; top: 650px; width: 30px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 356px; top: 644px; width: 1px; height: 13px; background: #5A4630"></div>
<div style="position: absolute; left: 386px; top: 644px; width: 1px; height: 13px; background: #5A4630"></div>
<div style="position: absolute; left: 296px; top: 660px; width: 90px; text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">≈0,75 m</div>

<div style="position: absolute; left: 488px; top: 272px; width: 280px; height: 48px; background: #9FA8B0; border: 2px solid #5F6B75; box-sizing: border-box"></div>
<div style="position: absolute; left: 768px; top: 272px; width: 172px; height: 28px; background: #9FA8B0; border: 2px solid #5F6B75; box-sizing: border-box"></div>

<div style="position: absolute; left: 488px; top: 264px; width: 452px; height: 8px; background: #8C4F3A"></div>
<div style="position: absolute; left: 948px; top: 250px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #8C4F3A">muro 0,2 m</div>
<div style="position: absolute; left: 284px; top: 312px; width: 204px; height: 8px; background: #8C4F3A"></div>

<div style="position: absolute; left: 356px; top: 400px; width: 30px; height: 232px; background: radial-gradient(circle at center, #F7C894 0px, #F7C894 3px, transparent 3.6px) 0 0 / 12px 12px, radial-gradient(circle at center, #F7C894 0px, #F7C894 3px, transparent 3.6px) 6px 6px / 12px 12px, #C9824A"></div>

<div style="position: absolute; left: 320px; top: 284px; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #D32F2F; color: #D32F2F; font-size: 14px; font-weight: 700; line-height: 20px; text-align: center">5</div>
<div style="position: absolute; left: 728px; top: 236px; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #D32F2F; color: #D32F2F; font-size: 14px; font-weight: 700; line-height: 20px; text-align: center">2</div>
<div style="position: absolute; left: 664px; top: 284px; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #D32F2F; color: #D32F2F; font-size: 14px; font-weight: 700; line-height: 20px; text-align: center">3</div>
<div style="position: absolute; left: 359px; top: 504px; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #D32F2F; color: #D32F2F; font-size: 14px; font-weight: 700; line-height: 20px; text-align: center">4</div>

<div style="position: absolute; left: 386px; top: 713.3px; width: 665px; height: 62.7px; clip-path: polygon(0px 0px, 628px 0px, 664.2px 62.7px, 0px 62.7px); background: radial-gradient(circle, #4E2D78 0.8px, transparent 1.3px) 0 0 / 7px 7px, radial-gradient(circle, #D2B6EE 0.8px, transparent 1.3px) 3px 4px / 9px 9px, radial-gradient(circle, #6F44A3 0.7px, transparent 1.2px) 5px 1px / 11px 11px, #9366BF"></div>
<div style="position: absolute; left: 688px; top: 733px; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #D32F2F; color: #D32F2F; font-size: 14px; font-weight: 700; line-height: 20px; text-align: center">8</div>

<div style="position: absolute; left: 472px; top: 272px; width: 1px; height: 48px; background: #5A4630"></div>
<div style="position: absolute; left: 466px; top: 272px; width: 13px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 466px; top: 320px; width: 13px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 392px; top: 287px; width: 66px; text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">1,20 m</div>

<div style="position: absolute; left: 960px; top: 272px; width: 1px; height: 28px; background: #5A4630"></div>
<div style="position: absolute; left: 954px; top: 272px; width: 13px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 954px; top: 300px; width: 13px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 972px; top: 277px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">0,7 m</div>

<div style="position: absolute; left: 284px; top: 320px; width: 204px; height: 80px; background: #9FA8B0; border: 2px solid #5F6B75; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px">
<div style="font-size: 13px; font-weight: 600; color: #20272D">Placa de hormigón</div>
<div style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #20272D">≈5,1 × 2 m</div>
</div>

<div style="position: absolute; left: 488px; top: 320px; width: 280px; height: 80px; background: #D3C09C; border: 3px solid #5A4630; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px">
<div style="font-size: 14px; font-weight: 600">Gallinero</div>
<div style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">2 × 7 m</div>
</div>

<div style="position: absolute; left: 768px; top: 300px; width: 172px; height: 100px; background: #D3C09C; border: 3px solid #5A4630; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px">
<div style="font-size: 14px; font-weight: 600">Trastero</div>
<div style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">2,5 × 4,3 m</div>
</div>

<div style="position: absolute; left: 940px; top: 386px; width: 40px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 940px; top: 380px; width: 1px; height: 13px; background: #5A4630"></div>
<div style="position: absolute; left: 980px; top: 380px; width: 1px; height: 13px; background: #5A4630"></div>
<div style="position: absolute; left: 940px; top: 362px; width: 40px; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">1 m</div>

<div style="position: absolute; left: 405px; top: 245px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #6A675E">↑ parte de atrás</div>

<div style="position: absolute; left: 420px; top: 400px; width: 560px; height: 224px; background: #EADCC2; border: 4px solid #5A4630; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center">
<div style="font-size: 28px; font-weight: 600; letter-spacing: 0.08em">CABAÑA</div>
<div style="font-family: 'IBM Plex Mono', monospace; font-size: 16px; color: #5A4630">14 × 5,6 m · 78,4 m²</div>
</div>

<div style="position: absolute; left: 620.8px; top: 624px; width: 323.2px; height: 69.3px; background: #D3C09C; border: 3px solid #5A4630; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px">
<div style="font-size: 14px; font-weight: 600">Porche</div>
<div style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">8,08 × 1,73 m · 14 m²</div>
</div>

<div style="position: absolute; left: 944px; top: 650px; width: 36px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 944px; top: 643px; width: 1px; height: 15px; background: #5A4630"></div>
<div style="position: absolute; left: 980px; top: 643px; width: 1px; height: 15px; background: #5A4630"></div>
<div style="position: absolute; left: 1022px; top: 641px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">0,9 m</div>

<div style="position: absolute; left: 600px; top: 693px; width: 1px; height: 20px; background: #5A4630"></div>
<div style="position: absolute; left: 594px; top: 693px; width: 13px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 594px; top: 713px; width: 13px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 548px; top: 695px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">0,5 m</div>

<div style="position: absolute; left: 980px; top: 480px; width: 34px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 980px; top: 474px; width: 1px; height: 13px; background: #5A4630"></div>
<div style="position: absolute; left: 1014px; top: 474px; width: 1px; height: 13px; background: #5A4630"></div>
<div style="position: absolute; left: 1022px; top: 464px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">≈0,85 m</div>

<div style="position: absolute; left: 420px; top: 820px; width: 560px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 420px; top: 813px; width: 1px; height: 15px; background: #5A4630"></div>
<div style="position: absolute; left: 980px; top: 813px; width: 1px; height: 15px; background: #5A4630"></div>
<div style="position: absolute; left: 420px; top: 830px; width: 560px; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: #5A4630">14 m · frontal cabaña</div>

<div style="position: absolute; left: 386px; top: 870px; width: 628px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 386px; top: 863px; width: 1px; height: 15px; background: #5A4630"></div>
<div style="position: absolute; left: 1014px; top: 863px; width: 1px; height: 15px; background: #5A4630"></div>
<div style="position: absolute; left: 386px; top: 880px; width: 628px; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: #5A4630">15,7 m · frontal acera</div>

<div style="position: absolute; left: 195px; top: 400px; width: 1px; height: 224px; background: #5A4630"></div>
<div style="position: absolute; left: 188px; top: 400px; width: 15px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 188px; top: 624px; width: 15px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 25px; top: 504px; width: 150px; text-align: right; font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: #5A4630">5,6 m · lateral</div>

<div style="position: absolute; left: 212px; top: 769.5px; width: 834px; height: 16px; background: #B7E2A3"></div>
<div style="position: absolute; left: 236px; top: 765.5px; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #D32F2F; color: #D32F2F; font-size: 14px; font-weight: 700; line-height: 20px; text-align: center">6</div>
<div style="position: absolute; left: 356px; top: 733px; width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%; background: #FFFFFF; border: 2px solid #D32F2F; color: #D32F2F; font-size: 14px; font-weight: 700; line-height: 20px; text-align: center">7</div>
<div style="position: absolute; left: 1132px; top: 769.5px; width: 41px; height: 16px; background: #B7E2A3; clip-path: polygon(4px 0px, 41px 0px, 41px 16px, 4px 16px); transform-origin: 0 50%; transform: rotate(-1.25deg)"></div>
<div style="position: absolute; left: 1171.98px; top: 768.63px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-3.75deg)"></div>
<div style="position: absolute; left: 1211.89px; top: 766.01px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-6.25deg)"></div>
<div style="position: absolute; left: 1251.65px; top: 761.66px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-8.75deg)"></div>
<div style="position: absolute; left: 1291.18px; top: 755.57px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-11.25deg)"></div>
<div style="position: absolute; left: 1330.41px; top: 747.77px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-13.75deg)"></div>
<div style="position: absolute; left: 1369.27px; top: 738.27px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-16.25deg)"></div>
<div style="position: absolute; left: 1407.66px; top: 727.07px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-18.75deg)"></div>
<div style="position: absolute; left: 1445.53px; top: 714.22px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-21.25deg)"></div>
<div style="position: absolute; left: 1482.82px; top: 699.72px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-23.75deg)"></div>
<div style="position: absolute; left: 1519.4px; top: 683.62px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-26.25deg)"></div>
<div style="position: absolute; left: 1555.29px; top: 665.92px; width: 41px; height: 16px; background: #B7E2A3; transform-origin: 0 50%; transform: rotate(-28.75deg)"></div>
<div style="position: absolute; left: 384px; top: 713.3px; width: 4px; height: 62.7px; background: #1E6FD9"></div>
<div style="position: absolute; left: 1014px; top: 711.3px; width: 72.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(60deg)"></div>
<div style="position: absolute; left: 1071px; top: 671.5px; width: 118.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(60deg)"></div>
<div style="position: absolute; left: 1071px; top: 671.5px; width: 61px; height: 4px; background: #1E6FD9"></div>
<div style="position: absolute; left: 1132px; top: 671.5px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-1.25deg)"></div>
<div style="position: absolute; left: 1167.45px; top: 670.73px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-3.75deg)"></div>
<div style="position: absolute; left: 1202.83px; top: 668.41px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-6.25deg)"></div>
<div style="position: absolute; left: 1238.08px; top: 664.55px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-8.75deg)"></div>
<div style="position: absolute; left: 1273.12px; top: 659.15px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-11.25deg)"></div>
<div style="position: absolute; left: 1307.9px; top: 652.23px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-13.75deg)"></div>
<div style="position: absolute; left: 1342.34px; top: 643.81px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-16.25deg)"></div>
<div style="position: absolute; left: 1376.39px; top: 633.89px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-18.75deg)"></div>
<div style="position: absolute; left: 1409.96px; top: 622.5px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-21.25deg)"></div>
<div style="position: absolute; left: 1443px; top: 609.64px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-23.75deg)"></div>
<div style="position: absolute; left: 1475.46px; top: 595.36px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-26.25deg)"></div>
<div style="position: absolute; left: 1507.27px; top: 579.67px; width: 36.4px; height: 4px; background: #1E6FD9; transform-origin: 0 50%; transform: rotate(-28.75deg)"></div>
<div style="position: absolute; left: 212px; top: 776px; width: 920px; height: 3px; background: #4B3A28"></div>
<div style="position: absolute; left: 208px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 288px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 368px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 448px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 528px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 608px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 688px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 768px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 848px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 928px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 1008px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 1088px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 1128px; top: 771px; width: 8px; height: 13px; background: #4B3A28"></div>
<div style="position: absolute; left: 212px; top: 790px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #4B3A28">vallado · postes cada 2 m · franja verde ±0,2 m</div>

<div style="position: absolute; left: 1132px; top: 776px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-1.25deg)"></div>
<div style="position: absolute; left: 1171.98px; top: 775.13px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-3.75deg)"></div>
<div style="position: absolute; left: 1211.89px; top: 772.51px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-6.25deg)"></div>
<div style="position: absolute; left: 1251.65px; top: 768.16px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-8.75deg)"></div>
<div style="position: absolute; left: 1291.18px; top: 762.07px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-11.25deg)"></div>
<div style="position: absolute; left: 1330.41px; top: 754.27px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-13.75deg)"></div>
<div style="position: absolute; left: 1369.27px; top: 744.77px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-16.25deg)"></div>
<div style="position: absolute; left: 1407.66px; top: 733.57px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-18.75deg)"></div>
<div style="position: absolute; left: 1445.53px; top: 720.72px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-21.25deg)"></div>
<div style="position: absolute; left: 1482.82px; top: 706.22px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-23.75deg)"></div>
<div style="position: absolute; left: 1519.40px; top: 690.12px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-26.25deg)"></div>
<div style="position: absolute; left: 1555.29px; top: 672.42px; width: 40.5px; height: 3px; background: #4B3A28; transform-origin: 0 50%; transform: rotate(-28.75deg)"></div>

<div style="position: absolute; left: 1207.89px; top: 767.51px; width: 8px; height: 13px; background: #4B3A28; transform: rotate(-5deg)"></div>
<div style="position: absolute; left: 1287.18px; top: 757.07px; width: 8px; height: 13px; background: #4B3A28; transform: rotate(-10deg)"></div>
<div style="position: absolute; left: 1365.27px; top: 739.77px; width: 8px; height: 13px; background: #4B3A28; transform: rotate(-15deg)"></div>
<div style="position: absolute; left: 1441.53px; top: 715.72px; width: 8px; height: 13px; background: #4B3A28; transform: rotate(-20deg)"></div>
<div style="position: absolute; left: 1515.40px; top: 685.12px; width: 8px; height: 13px; background: #4B3A28; transform: rotate(-25deg)"></div>
<div style="position: absolute; left: 1586.35px; top: 648.19px; width: 8px; height: 13px; background: #4B3A28; transform: rotate(-30deg)"></div>
<div style="position: absolute; left: 1330px; top: 790px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #4B3A28">curva ≈30° · 12 m</div>

<div style="position: absolute; left: 1150px; top: 713px; width: 1px; height: 64px; background: #5A4630"></div>
<div style="position: absolute; left: 1144px; top: 713px; width: 13px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 1144px; top: 777px; width: 13px; height: 1px; background: #5A4630"></div>
<div style="position: absolute; left: 1162px; top: 737px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #5A4630">≈1,6 m</div>

<div style="position: absolute; left: 40px; top: 950px; width: 200px; height: 6px; background: #2B2A26"></div>
<div style="position: absolute; left: 40px; top: 930px; font-family: 'IBM Plex Mono', monospace; font-size: 12px">0</div>
<div style="position: absolute; left: 218px; top: 930px; font-family: 'IBM Plex Mono', monospace; font-size: 12px">5 m</div>

</div>



</div>
</div></div>
<p class="guia-doc-ayuda">Toca el plano para ampliarlo o ajustarlo a la pantalla. Medidas aproximadas.</p>
`;

// Id. en círculo rojo, igual que en el plano.
const cabanaId = (n) => `<span class="cabana-id">${n}</span>`;
const cabanaNum = (v) => (v === null ? '<span class="cabana-nada">—</span>' : v);

// [id, descripción, material, ancho, largo, grosor, volumen, excluidoDelTotal]
const CABANA_VOLUMENES = [
  [1, 'Rampa tras portilla', 'Hormigón y bloques', '2', '5', '0,1', '1'],
  [2, 'Murete parte trasera', 'Hormigón', '0,2', '11', '1', '2,2'],
  [3, 'Suelo parte trasera', 'Hormigón', '0,8', '11', '0,1', '0,88'],
  [4, 'Suelo entre acera y parrilla', 'Hormigón y Lajas', '0,75', '5,8', '0,2', '0,87'],
  [5, 'Murete Gallinero', 'Hormigón', '0,2', '6,6', '2', '2,64'],
  [6, 'Zócalo vallado', 'Hormigón', '0,3', '30', '0,3', '2,7'],
  [7, 'Zócalo rampa y caminos', 'Zócalos hechos de hormigón y hormigón', '0,2', '20', '0,2', '0,8', true],
  [8, 'Frontal grijo', 'Grijo y malla antihierbas', '1,6', '16', '0,2', '5,12'],
];

function cabanaTablaVolumenes() {
  const filas = CABANA_VOLUMENES.map(([id, desc, mat, ancho, largo, grosor, vol, excluido]) => `
    <tr>
      <td class="centro">${cabanaId(id)}</td>
      <td><strong>${desc}</strong></td>
      <td>${mat}</td>
      <td class="num">${ancho}</td>
      <td class="num">${largo}</td>
      <td class="num">${grosor}</td>
      <td class="num${excluido ? ' cabana-aviso' : ''}"><strong>${vol}</strong></td>
    </tr>`).join('');
  return `
  <p>Medidas en metros · volumen = ancho × largo × grosor (m³) · los números corresponden a la numeración del plano.</p>
  <div class="guia-doc-scroll">
    <table class="cabana-tabla">
      <thead><tr><th class="centro">Id.</th><th>Descripción</th><th>Material</th><th class="num">Ancho (m)</th><th class="num">Largo (m)</th><th class="num">Grosor (m)</th><th class="num">Volumen (m³)</th></tr></thead>
      <tbody>${filas}</tbody>
      <tfoot><tr><th colspan="6" class="num">Total</th><td class="num"><strong>15,41</strong></td></tr></tfoot>
    </table>
  </div>`;
}

// [material, P.U. Obramat, P.U. Construagro, cantidad, total Obramat, total Construagro]; null = sin precio.
const CABANA_MATERIALES = [
  ['Zócalo 100X20X8', '4,40', null, 20, '88,00', null],
  ['Zócalo 50X20X8', null, '1,74', 40, null, '69,60'],
  ['Hormigón seco 25Kg', '3,40', '3,71', 180, '612,00', '667,80'],
  ['Cemento 25Kg', '4,55', '5,30', 20, '91,00', '106,00'],
  ['Big Bag Arena 1000Kg', '38,00', null, 1, '38,00', null],
  ['Big Bag guijillo 1000Kg', '38,00', null, 3, '114,00', null],
  ['Big Bag Arena 1200Kg', null, '50,29', 1, null, '50,29'],
  ['Big Bag guijillo 1200Kg', null, '49,94', 3, null, '149,82'],
  ['Bloque 39X19X19', '2,22', '1,15', 14, '31,08', '16,10'],
  ['Albardilla 50X20', null, '7,85', 4, null, '31,40'],
  ['Albardilla 25X20', '1,20', '1,20', 8, '9,60', '9,60'],
  ['Transporte hasta 3000kg', '79,00', null, 0, null, null],
  ['Transporte 3001-5000', '109,00', null, 1, '109,00', null],
  ['Transporte 5001-9000', '175,00', null, 0, null, null],
  ['Transporte', null, '36,00', 1, null, '36,00'],
];

function cabanaTablaMateriales() {
  const eur = (v) => (v === null ? null : `€ ${v}`);
  const filas = CABANA_MATERIALES.map(([mat, puO, puC, cant, totO, totC]) => `
    <tr>
      <td><strong>${mat}</strong></td>
      <td class="num">${cabanaNum(eur(puO))}</td>
      <td class="num">${cabanaNum(eur(puC))}</td>
      <td class="num">${cant}</td>
      <td class="num"><strong>${cabanaNum(eur(totO))}</strong></td>
      <td class="num"><strong>${cabanaNum(eur(totC))}</strong></td>
    </tr>`).join('');
  return `
  <p>Importes en euros · total = precio unidad × cantidad · comparativa Obramat / Construagro.</p>
  <div class="guia-doc-scroll">
    <table class="cabana-tabla">
      <thead><tr><th>Material</th><th class="num">P.U. Obramat</th><th class="num">P.U. Construagro</th><th class="num">Cantidad</th><th class="num">Total Obramat</th><th class="num">Total Construagro</th></tr></thead>
      <tbody>${filas}</tbody>
      <tfoot>
        <tr><th colspan="4" class="num">Suma con big bags</th><td class="num"><strong>€ 480,68</strong></td><td class="num"><strong>€ 468,81</strong></td></tr>
        <tr><th colspan="4" class="num">Suma con sacos</th><td class="num"><strong>€ 849,68</strong></td><td class="num"><strong>€ 830,50</strong></td></tr>
      </tfoot>
    </table>
  </div>`;
}

const CABANA_LISTA = [
  { id: 'plano', icon: '🗺️', titulo: 'Plano de situación', html: CABANA_PLANO_HTML },
  { id: 'volumenes', icon: '📐', titulo: 'Tabla de volúmenes', html: cabanaTablaVolumenes() },
  { id: 'materiales', icon: '🧱', titulo: 'Materiales y costes', html: cabanaTablaMateriales() },
];
