import { faVirusSlash } from '@fortawesome/free-solid-svg-icons';
import pdfMake from 'pdfmake/build/pdfmake';
import printjs from 'print-js';



// import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : (pdfFonts.vfs || pdfFonts);

// const pdfFonts = await import('pdfmake/build/vfs_fonts');
// pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.default?.pdfMake?.vfs;



// Esta función carga el script de fuentes solo cuando se necesita
const loadFonts = () => {
  return new Promise((resolve) => {
    if (pdfMake.vfs) return resolve(); // Ya cargadas

    const script = document.createElement('script');
    script.src = '/vfs_fonts.js'; // Ruta al archivo en la carpeta public
    script.onload = () => {
      // pdfMake v0.2.x registra automáticamente el vfs en el objeto global pdfMake
      // si el script de arriba se cargó correctamente.
      if (window.pdfMake && window.pdfMake.vfs) {
        pdfMake.vfs = window.pdfMake.vfs;
      }
      resolve();
    };
    document.head.appendChild(script);
  });
};



const createPdf = async (props, output = 'print') => {
 try {
        // Asignamos pdfMake al objeto global para que vfs_fonts lo encuentre
        window.pdfMake = pdfMake;
        
        // Cargamos las fuentes desde la carpeta public
        await loadFonts();

        // Configuración de fuentes fallback
        pdfMake.fonts = {
            Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Regular.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-Italic.ttf'
            }
        };
    } catch (e) {
        console.error("Error cargando vfs_fonts:", e);
    }
  return new Promise((resolve, reject) => {
    try {
      const {
        pageSize = {
          width: 595.28,
          height: 790.995
        },

        pageMargins = [40.66, 30.66, 35.66, 30.66],
        info = {
          title: 'hictoria clinica',
          author: 'System sucre',
          subject: 'cONSULTORIA DE SOWFARE Z/EX-ESTACION PARQUE-BOLIVAR',
          keywords: 'DESARROLLO DE S.I.',
        },
        styles = {
          header: {
            fontSize: 8,
            bold: true,
            alignment: 'center',
          },
          tHeaderLabel: {
            fontSize: 7,
            alignment: 'right',
          },
          fechaTratamiento: {
            margin: [0, 1, 0, 10],
            fontSize: 7,
            bold: true,
          },
          nhcheader: {
            fontSize: 10,
            margin: [0, 0, 0, 0],
            bold: true,
            alignment: 'left',
          },
          tProductsHeader: {
            fontSize: 7.5,
            bold: true,
          },
          text: {
            margin: [0, 1, 0, 0],
            fontSize: 9,
            alignment: 'center',
          },
          line: {
            margin: [0, 0, 0, 0],
            fontSize: 14,
            color: '#4E5AFE',
            bold: true,
            alignment: 'center',
          },
          piePagina: {
            fontSize: 6,
            alignment: 'center',
          },
          tankYou: {
            fontSize: 10,
            alignment: 'center',
          },
          hc: {
            fontSize: 15,
            bold: true,
            alignment: 'center',
          },
          link: {
            fontSize: 7,
            bold: true,
            margin: [0, 0, 0, 4],
            alignment: 'center',
          },
        },
        content,


      } = props;

      const docDefinition = {
        pageSize, //TAMAÑO HOJA
        pageMargins, //MARGENES HOJA
        info, //METADATA PDF
        content, // CONTENIDO PDF
        styles, //ESTILOS PDF
      };

      if (output === 'b64') {
        //SI INDICAMOS QUE LA SALIDA SERA [b64] Base64
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
        pdfMakeCreatePdf.getBase64((data) => {
          resolve({
            success: true,
            content: data,
            message: 'Archivo generado correctamente.',
          });
        });
        return;
      }

      //ENVIAR A IMPRESIÓN DIRECTA
      if (output === 'print') {
        const pdfMakeCreatePdf = pdfMake.createPdf(docDefinition);
        pdfMakeCreatePdf.getBase64((data) => {
          printjs({
            printable: data,
            type: 'pdf',
            base64: true,
          });
          resolve({
            success: true,
            content: null,
            message: 'Documento enviado a impresión.',
          });
        });
        return;
      }

      reject({
        success: false,
        content: null,
        message: 'Debes enviar tipo salida.',
      });
    } catch (error) {
      reject({
        success: false,
        content: null,
        message: error?.message ?? 'No se pudo generar proceso.',
      });
    }
  });
};

export default createPdf;
