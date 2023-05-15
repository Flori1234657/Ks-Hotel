import {
  disabledDatesGushtExport,
  disabledDatesQershorExport,
  disabledDatesKorrigExport, //\d+$ per ti nxjerr daten
  currentYear,
} from "../components/jsDatepicker";
import { dergoObjektin } from "./submitBtn";

const checkIn = document.getElementById("datFillim");
const checkOut = document.getElementById("datMbarim");
const adoleshent = document.getElementById("adoleshenta");
const femijet = document.getElementById("femije");

export const emri = document.getElementById("emriInput");
export const mbiemri = document.getElementById("mbiemriInput");
export const selectTeRitur = document.getElementById("selectTeRritur");
export const selectFemije = document.getElementById("selectFemije");
export const ardhja = document.getElementById("ardhjaForme");
export const ikja = document.getElementById("ikjaForme");
export const email = document.getElementById("emailForme");
export const telefon = document.getElementById("telefoniForme");
export const dhDizpozicion = document.getElementById("dhomatDizpozicSelc");
export const lekTotal = document.getElementById("totaliLek");
const submitBtn = document.getElementById("rezervoFormBtn");

//Errors
const ardhjaError = document.getElementById("ardhjaError");
const ikjaError = document.getElementById("ikjaError");

export let ditetQendrimitArr = [];
export let ditetQendrimitArrAutofill;
export const fushatArray = [
  emri,
  mbiemri,
  selectTeRitur,
  selectFemije,
  email,
  telefon,
  dhDizpozicion,
];

const fshArrString = [
  "emri",
  "mbiemri",
  "selectTeRitur",
  "selectFemije",
  "email",
  "telefon",
  "dhDizpozicion",
];

const errObj = {
  emri: {
    lloj: /[a-z]/gi,
    errMsg: "Ju lutem përdorni vetëm shkronja!",
  },
  mbiemri: {
    lloj: /[a-z]/gi,
    errMsg: "Ju lutem përdorni vetëm shkronja!",
  },
  selectTeRitur: {
    lloj: /[\d]/,
    errMsg: "Ju lutem plotësojeni!",
  },
  selectFemije: {
    lloj: /[\d]/,
    errMsg: "Ju lutem plotësojeni!",
  },
  email: {
    lloj: /\w+[@]\w+[.]\w+/,
    errMsg: "Ju lutem vendosni formatin e saktë!",
  },
  telefon: {
    lloj: /\d+/,
    errMsg: "Ju lutem shënoni numrin saktë",
  },
  dhDizpozicion: {
    lloj: /[dhomteke |dhomcift |dhomfamiljare]/g,
    errMsg: "Ju lutem zgjidhni një dhomë",
  },
};

export let lejoKalimin = false;

export const lejoKalim = () => {
  if (
    /\d/g.test(checkIn.value) &&
    /\d/g.test(checkOut.value) &&
    /\d/g.test(adoleshent.value) &&
    /\d/g.test(femijet.value)
  ) {
    lejoKalimin = true;
  } else {
    lejoKalimin = false;
    alert("Ju Lutem Mos Lini vënde bosh");
  }
};
let fushatPlot = false;
export const fushatEvents = () => {
  fushatArray.forEach((el) => {
    el.addEventListener("input", (e) => {
      const elmsArr = fushatArray.filter((elm) => {
        return elm.value == "";
      });

      if (elmsArr.length == 0 && ardhja.value != "" && ikja.value != "") {
        fushatPlot = true;
        nxirrDitët(true);
        submitBtn.removeAttribute("disabled");
        submitBtn.style.backgroundColor = "#122244";
        submitBtn.style.borderColor = "#122244";
        submitBtn.style.cursor = "pointer";
      } else {
        fushatPlot = false;
        submitBtn.setAttribute("disabled", "");
        submitBtn.style.backgroundColor = "#93afee";
        submitBtn.style.borderColor = "#93afee";
        submitBtn.style.cursor = "not-allowed";
      }
    });
  });
};
let thyej = false;
export const nxirrDitët = (run) => {
  let qendrimi = {
    muajArdh: ardhja.value.match(/\d+/), //muaj/dit/vit
    muajIkj: ikja.value.match(/\d+/),
    dataArdh: ardhja.value.match(/(?<=\W)\d+/),
    dataIkj: ikja.value.match(/(?<=\W)\d+/),
  };

  //Fusim ditet e qendrimit ne array InshaaAllah
  if (qendrimi.muajArdh[0] == 6 && qendrimi.muajIkj[0] == 7) {
    for (let i = Number(qendrimi.dataArdh[0]); i <= 30; i++) {
      if (thyej) {
        ikja.value = `6/${i - 2}/${currentYear}`; //e kemi ven -2 pasi ija duhet te shkoj dy her posht vleres aktuale qe te shkoj ne vleren qe esht ne dizpozicion
        break;
      }
      mosfutjaDataaveJashtDizp(disabledDatesQershorExport, i);
    }
    for (let i = 1; i <= Number(qendrimi.dataIkj[0]); i++) {
      if (thyej) {
        ikja.value = `7/${i - 2}/${currentYear}`;
        break;
      }
      mosfutjaDataaveJashtDizp(disabledDatesKorrigExport, i);
    }
  } else if (qendrimi.muajArdh[0] == 6 && qendrimi.muajIkj[0] == 8) {
    for (let i = Number(qendrimi.dataArdh[0]); i <= 30; i++) {
      if (thyej) {
        ikja.value = `6/${i - 2}/${currentYear}`;
        break;
      }
      mosfutjaDataaveJashtDizp(disabledDatesQershorExport, i);
    }
    for (let i = 1; i <= 31; i++) {
      if (thyej) {
        ikja.value = `7/${i - 2}/${currentYear}`;
        break;
      }
      mosfutjaDataaveJashtDizp(disabledDatesKorrigExport, i);
    }
    for (let i = 1; i <= Number(qendrimi.dataIkj[0]); i++) {
      if (thyej) {
        ikja.value = `8/${i - 2}/${currentYear}`;
        break;
      }
      mosfutjaDataaveJashtDizp(disabledDatesGushtExport, i);
    }
  } else if (qendrimi.muajArdh[0] == 7 && qendrimi.muajIkj[0] == 8) {
    for (let i = Number(qendrimi.dataArdh[0]); i <= 31; i++) {
      if (thyej) {
        ikja.value = `7/${i - 2}/${currentYear}`;
        break;
      }
      mosfutjaDataaveJashtDizp(disabledDatesKorrigExport, i);
    }
    for (let i = 1; i <= Number(qendrimi.dataIkj[0]); i++) {
      if (thyej) {
        ikja.value = `8/${i - 2}/${currentYear}`;
        break;
      }
      mosfutjaDataaveJashtDizp(disabledDatesGushtExport, i);
    }
  } else if (qendrimi.muajArdh[0] == qendrimi.muajIkj[0]) {
    if (qendrimi.muajArdh[0] == 6) {
      for (
        let i = Number(qendrimi.dataArdh[0]);
        i <= Number(qendrimi.dataIkj[0]);
        i++
      ) {
        if (thyej) {
          ikja.value = `6/${i - 2}/${currentYear}`;
          break;
        }
        mosfutjaDataaveJashtDizp(disabledDatesQershorExport, i);
      }
    } else if (qendrimi.muajArdh[0] == 7) {
      for (
        let i = Number(qendrimi.dataArdh[0]);
        i <= Number(qendrimi.dataIkj[0]);
        i++
      ) {
        if (thyej) {
          ikja.value = `7/${i - 2}/${currentYear}`;
          break;
        }
        mosfutjaDataaveJashtDizp(disabledDatesKorrigExport, i);
      }
    } else if (qendrimi.muajArdh[0] == 8) {
      for (
        let i = Number(qendrimi.dataArdh[0]);
        i <= Number(qendrimi.dataIkj[0]);
        i++
      ) {
        if (thyej) {
          ikja.value = `8/${i - 2}/${currentYear}`;
          break;
        }
        mosfutjaDataaveJashtDizp(disabledDatesGushtExport, i);
      }
    }
  } else {
    ardhjaError.style.display = "block";
    ikjaError.style.display = "block";
    ardhjaError.innerText = "Muaj i ardhjes duhet më posht";
    ikjaError.innerText = "Se muaj i ikjes";
    ardhja.value = "";
    ikja.value = "";
    ditetQendrimitArr = [];
    thyej = false;
    return;
  }
  thyej = false;
  //Erroret
  if (
    Number(qendrimi.muajArdh[0]) == Number(qendrimi.muajIkj[0]) &&
    Number(qendrimi.dataArdh[0]) > Number(qendrimi.dataIkj[0])
  ) {
    ardhjaError.style.display = "block";
    ikjaError.style.display = "block";
    ardhjaError.innerText = "Data e ardhjes duhet më posht";
    ikjaError.innerText = "Se dita e ikjes";

    ardhja.value = "";
    ikja.value = "";
    ditetQendrimitArr = [];
    return;
  }

  if (run) {
    //kte e vem per arsye se ky funksion do perdoret dhe ne vend tjeter
    if (dhDizpozicion.value == "dhomteke") {
      lekTotal.innerText = `$${ditetQendrimitArr.length * 100}`;
    } else if (dhDizpozicion.value == "dhomcift") {
      lekTotal.innerText = `$${ditetQendrimitArr.length * 120}`;
    } else if (dhDizpozicion.value == "dhomfamiljare") {
      lekTotal.innerText = `$${ditetQendrimitArr.length * 150}`;
    }
  }
  ditetQendrimitArrAutofill = ditetQendrimitArr;
  ditetQendrimitArr = [];
};
const mosfutjaDataaveJashtDizp = (spec, i) => {
  ditetQendrimitArr.push(i);
  spec.forEach((e) => {
    if (e.match(/\d+$/) == i) {
      thyej = true;
    }
  });
};

//Erroret Mbas Shtypjes se Butonit InshaaAllah
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let i = 0;
  let drgObj = true;
  fushatArray.forEach((el) => {
    i++;
    if (!errObj[fshArrString[i - 1]].lloj.test(el.value)) {
      el.nextElementSibling.innerText = `${errObj[fshArrString[i - 1]].errMsg}`;
      el.nextElementSibling.style.display = "block";
      submitBtn.setAttribute("disabled", "");
      submitBtn.style.backgroundColor = "#93afee";
      submitBtn.style.borderColor = "#93afee";
      submitBtn.style.cursor = "not-allowed";
      drgObj = false;
    } else {
      ardhjaError.style.display = "none";
      ikjaError.style.display = "none";
      el.nextElementSibling.style.display = "none";
    }
  });

  //Ktu InshaaAllah duhet te fus funksionin perfundimtar
  if (drgObj) {
    dergoObjektin();
  }
});
