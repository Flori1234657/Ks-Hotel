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
//Kto posht per ti eksportuar para se te boshatisen arrayt lart
export let disabledDatesQershorExport;
export let disabledDatesKorrigExport;
export let disabledDatesGushtExport;

export const currentYear = new Date().getFullYear();
const dataSot = new Date();

const disabledPastDate = [];

//Bllokojme te gjitha datat nga sot e pas InshaaAllah
let dsbDatI = Number(dataSot.getDate());

const disablePastDates = (muaj) => {
  if (dsbDatI === 0) return;

  if (muaj == 6) {
    disabledPastDate.push(`${currentYear}, ${muaj}, ${dsbDatI}`);
    dsbDatI--;
    disablePastDates(muaj);
  } else if (muaj == 7) {
    disabledPastDate.push(`${currentYear}, ${muaj}, ${dsbDatI}`);
    if (dsbDatI === 1) {
      dsbDatI = 30;
      disablePastDates(6);
      return;
    }
    dsbDatI--;
    disablePastDates(7);
  } else if (muaj == 8) {
    disabledPastDate.push(`${currentYear}, ${muaj}, ${dsbDatI}`);
    if (dsbDatI === 1) {
      dsbDatI = 31;
      disablePastDates(7);
      return;
    }
    dsbDatI--;
    disablePastDates(8);
  }
};

//Ktu po fusim te gjitha datat qe kemi ne dizp. InshaaAllah
const allAvailableDates = (path, arr) => {
  Object.entries(path).forEach((el) => {
    const [key, value] = el;
    arr.push(Number(key.match(/\d+/)[0]));
  });
};

//Pastaj i pershkojme qe te gjejme ato qe na mungojn InshaaAllah
let llog = 0;
const findLostDate = (fundMuaj, muajIndex, sortedArr, disableArr) => {
  for (let i = 1; i <= Number(fundMuaj); i++) {
    llog += 1;
    if (i != sortedArr[llog - 1]) {
      disableArr.push(`${currentYear}, ${muajIndex}, ${i}`);
      i += 1; //E shtojme dhe njeher i qe te ver me vlera te njellojta
    }
  }
  llog = 0;
};

export const getFirestoreDate = async () => {
  disablePastDates(dataSot.getMonth() + 1);
  try {
    const docs = await getDocs(collection(db, "Dizpozicioni")).then((dc) => {
      return dc.docs.map((el) => {
        return el.data();
      });
    });

    const [sortedQershor, sortedKorrig, sortedGusht] = [[], [], []];

    allAvailableDates(docs[0].muajt.qershor.datatDhomat, sortedQershor);
    allAvailableDates(docs[0].muajt.korrig.datatDhomat, sortedKorrig);
    allAvailableDates(docs[0].muajt.gusht.datatDhomat, sortedGusht);

    [sortedQershor, sortedKorrig, sortedGusht].forEach((el) => {
      el.sort(function (a, b) {
        return a - b;
      });
    });

    findLostDate(30, 6, sortedQershor, disabledDatesQershor);
    findLostDate(31, 7, sortedKorrig, disabledDatesKorrig);
    findLostDate(31, 8, sortedGusht, disabledDatesGusht);

    const fullDisabledDates = [
      ...disabledDatesQershor,
      ...disabledDatesKorrig,
      ...disabledDatesGusht,
      ...disabledPastDate,
    ];

    setCalendar(fullDisabledDates);

    [
      disabledDatesQershorExport,
      disabledDatesKorrigExport,
      disabledDatesGushtExport,
    ] = [disabledDatesQershor, disabledDatesKorrig, disabledDatesGusht];

    [disabledDatesQershor, disabledDatesKorrig, disabledDatesGusht] = [
      [],
      [],
      [],
    ];
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
        blockSelected(ardhjaForme.value);
      }
    },
  });

  const customCalendar = () => {
    pickerIkja.el.style.cursor = "not-allowed";
    pickerIkja.el.disabled = true;
  };
  customCalendar();

  //Bllokojme daten qe klikohet qe mos te zgjidhet InshaaAllah
  const blockSelected = (el) => {
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
