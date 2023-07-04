import datepicker from "js-datepicker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.js";
import { nxirrDitët, fushatArray } from "../utils/validateDizpozicion.js";
import { autofillDhomPerDatChange } from "../utils/autoFillFields.js";

const ardhjaForme = document.getElementById("ardhjaForme");
const ikjaForme = document.getElementById("ikjaForme");
const submitBtn = document.getElementById("rezervoFormBtn");
let disabledDatesQershor = [];
let disabledDatesKorrig = [];
let disabledDatesGusht = [];
//Kto posht per ti ekportuar para se te boshatisen arrayt lart
export let disabledDatesQershorExport;
export let disabledDatesKorrigExport;
export let disabledDatesGushtExport;

export const currentYear = new Date().getFullYear();
const dataSot = new Date();

let disabledPastDate;

//Bllokojme te gjitha datat nga sot e pas InshaaAllah
const disablePastDates = () => {
  const disabledPastDat = [];

  if (dataSot.getMonth() == 7) {
    for (let i = Number(dataSot.getDate()); i > 0; i--) {
      disabledPastDat.push(`${currentYear}, ${dataSot.getMonth()}, ${i}`);
    }
    for (let i = 30; i > 0; i--) {
      disabledPastDat.push(`${currentYear}, 6, ${i}`);
    }
  } else if (dataSot.getMonth() == 8) {
    for (let i = Number(dataSot.getDate()); i > 0; i--) {
      disabledPastDat.push(`${currentYear}, ${dataSot.getMonth()}, ${i}`);
    }
    for (let i = 31; i > 0; i--) {
      disabledPastDat.push(`${currentYear}, 7, ${i}`);
    }
    for (let i = 30; i > 0; i--) {
      disabledPastDat.push(`${currentYear}, 6, ${i}`);
    }
  } else {
    for (let i = Number(dataSot.getDate()); i > 0; i--) {
      disabledPastDat.push(`${currentYear}, ${dataSot.getMonth()}, ${i}`);
    }
  }

  disabledPastDate = disabledPastDat;
};

export const getFirestoreDate = async () => {
  disablePastDates();
  try {
    const docs = await getDocs(collection(db, "Dizpozicioni")).then((dc) => {
      return dc.docs.map((el) => {
        return el.data();
      });
    });

    const sortedQershor = [];
    const sortedKorrig = [];
    const sortedGusht = [];
    Object.entries(docs[0].muajt.qershor.datatDhomat).forEach((el) => {
      const [key, value] = el; //Ktu po fusim datat qe nuk ekzistojne InshaaAllah
      sortedQershor.push(Number(key.match(/\d+/)[0]));
    });
    //I rendisim datat ne nje array tjeter qe te kemi mundesi te krahasojme poshte
    sortedQershor.sort(function (a, b) {
      return a - b;
    });
    //Krahasojme datat InshaaAllah
    let llog = 0;
    for (let i = 1; i <= 30; i++) {
      llog += 1;
      if (i != sortedQershor[llog - 1]) {
        disabledDatesQershor.push(`${currentYear}, 6, ${i}`);
        i += 1; //E shtojme dhe njeher i qe te ver me vlera te njellojta
      }
    }

    Object.entries(docs[0].muajt.korrig.datatDhomat).forEach((el) => {
      const [key, value] = el;
      sortedKorrig.push(Number(key.match(/\d+/)[0]));
    });
    sortedKorrig.sort(function (a, b) {
      return a - b;
    });
    let llog2 = 0;
    for (let i = 1; i <= 31; i++) {
      llog2 += 1;
      if (i != sortedKorrig[llog2 - 1]) {
        disabledDatesKorrig.push(`${currentYear}, 7, ${i}`);
        i += 1;
      }
    }

    Object.entries(docs[0].muajt.gusht.datatDhomat).forEach((el) => {
      const [key, value] = el;
      sortedGusht.push(Number(key.match(/\d+/)[0]));
    });
    sortedGusht.sort(function (a, b) {
      return a - b;
    });
    let llog3 = 0;
    for (let i = 1; i <= 31; i++) {
      llog3 += 1;

      if (i != sortedGusht[llog3 - 1]) {
        disabledDatesGusht.push(`${currentYear}, 8, ${i}`);
        i += 1;
      }
    }

    let fullDisabledDates = [
      ...disabledDatesQershor,
      ...disabledDatesKorrig,
      ...disabledDatesGusht,
      ...disabledPastDate,
    ];

    setCalendar(fullDisabledDates);

    disabledDatesQershorExport = disabledDatesQershor;
    disabledDatesKorrigExport = disabledDatesKorrig;
    disabledDatesGushtExport = disabledDatesGusht;

    disabledDatesQershor = [];
    disabledDatesKorrig = [];
    disabledDatesGusht = [];
  } catch (error) {
    console.log(error);
    alert("Pati në problem provo më vonë");
  }
};

const setCalendar = (dsdsd) => {
  const configObj = {
    formatter: (input, date, instance) => {
      const value = date.toLocaleDateString();
      input.value = value; // => '1/1/2099'
    },
    startDay: 0,
    customDays: ["Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Sht"],
    customMonths: [
      "Janar",
      "Shkurt",
      "Mars",
      "Prill",
      "Maj",
      "Qershor",
      "Korrig",
      "Gusht",
      "Shtator",
      "Tetor",
      "Nëntor",
      "Dhjetor",
    ],
    customOverlayMonths: [
      "Janar",
      "Shkurt",
      "Mars",
      "Prill",
      "Maj",
      "Qershor",
      "Korrig",
      "Gusht",
      "Shtator",
      "Tetor",
      "Nëntor",
      "Dhjetor",
    ],
    overlayButton: "Vazhdo",
    overlayPlaceholder: "4-numra viti",
    maxDate: new Date(currentYear, 7, 31),
    minDate: new Date(currentYear, 5, 1),
    showAllDates: true,
    disabledDates: [
      ...dsdsd.map((el) => {
        return new Date(el);
      }),
      new Date(currentYear, dataSot.getDate(), dataSot.getMonth()),
    ],
  };

  const pickerArdhja = datepicker("#ardhjaForme", {
    ...configObj,
    onSelect: () => {
      if (/\d+\W\d+\W\d+/g.test(ardhjaForme.value)) {
        pickerIkja.el.disabled = false;
        pickerIkja.el.style.cursor = "auto";
      } else {
        pickerIkja.el.style.cursor = "not-allowed";
        pickerIkja.el.disabled = true;
      }

      if (
        /\d+\W\d+\W\d+/g.test(ardhjaForme.value) &&
        /\d+\W\d+\W\d+/g.test(ikjaForme.value)
      ) {
        chekIfFull();
        dhomatNeDizp();
      }
    },
  });
  const pickerIkja = datepicker("#ikjaForme", {
    ...configObj,
    onSelect: () => {
      if (
        /\d+\W\d+\W\d+/g.test(ardhjaForme.value) &&
        /\d+\W\d+\W\d+/g.test(ikjaForme.value)
      ) {
        chekIfFull();
        dhomatNeDizp();
      }

      if (/\d+\W\d+\W\d+/g.test(ardhjaForme.value)) {
        blockSelected();
      }
    },
  });

  const customCalendar = () => {
    pickerIkja.el.style.cursor = "not-allowed";
    pickerIkja.el.disabled = true;
  };
  customCalendar();

  //Bllokojme daten qe klikohet qe mos te zgjidhet InshaaAllah
  const blockSelected = () => {
    if (
      ardhjaForme.value.match(/\d+/)[0] == 8 &&
      ardhjaForme.value.match(/(?<=\W)\d+/)[0] == 31
    ) {
      ardhjaForme.value = "";
      ikjaForme.value = "";
      ikjaForme.disabled = true;
      alert("Nuk mund të rezervoni mbas datës 31 gusht!");
      return;
    }

    let ikjaVal = ikjaForme.value;

    if (ikjaVal.match(/\d+/)[0] == 7 && ikjaVal.match(/(?<=\W)\d+/)[0] == 31) {
      ikjaForme.innerHTML = `8/1/${ikjaVal.match(/\d+$/)[0]}`;
    } else if (
      ikjaVal.match(/\d+/)[0] == 6 &&
      ikjaVal.match(/(?<=\W)\d+/)[0] == 30
    ) {
      ikjaForme.innerHTML = `7/1/${ikjaVal.match(/\d+$/)[0]}`;
    } else if (
      ikjaVal.match(/(?<=\W)\d+/)[0] == ardhjaForme.value.match(/(?<=\W)\d+/)[0]
    ) {
      ikjaForme.value = `${ikjaVal.match(/\d+/)[0]}/${
        Number(ikjaVal.match(/(?<=\W)\d+/)[0]) + 1
      }/${ikjaVal.match(/\d+$/)[0]}`;
    }
  };
};

let elmsArr;
const chekIfFull = () => {
  elmsArr = fushatArray.filter((elm) => {
    return elm.value == "";
  });

  if (elmsArr.length == 0 && ardhjaForme.value != "" && ikjaForme.value != "") {
    nxirrDitët(true); //nese esht full bejme dhe llogaritjen e lekve
  } else {
    nxirrDitët(false);
  }
};

const dhomatNeDizp = async () => {
  ardhjaForme.setAttribute("disabled", "");
  ikjaForme.setAttribute("disabled", "");
  ardhjaForme.style.filter = "brightness(50%)";
  ikjaForme.style.filter = "brightness(50%)";
  try {
    const docs = await getDocs(collection(db, "Dizpozicioni")).then((dt) => {
      return dt.docs.map((el) => {
        return el.data();
      });
    });
    autofillDhomPerDatChange(docs); //funksioni per te nxjerr dhomat ne dizpozicion ne varsi te datave InshaaAllah
  } catch (error) {
    console.log(error);
    alert("Ndodhi një gabim në server ju lutem provoni më vonë");
    submitBtn.setAttribute("disabled", "");
    submitBtn.style.backgroundColor = "#93afee";
    submitBtn.style.borderColor = "#93afee";
    submitBtn.style.cursor = "not-allowed";
  }

  ardhjaForme.removeAttribute("disabled");
  ikjaForme.removeAttribute("disabled");
  ardhjaForme.style.filter = "brightness(100%)";
  ikjaForme.style.filter = "brightness(100%)";
};
