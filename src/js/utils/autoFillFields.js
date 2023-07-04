import {
  checkIn,
  checkOut,
  adoleshent,
  femijet,
  llojIDhomes,
  arrLength,
} from "./formSubmit";
import { ditetQendrimitArrAutofill } from "./validateDizpozicion";

const selectTeRitur = document.getElementById("selectTeRritur");
const selectFemije = document.getElementById("selectFemije");
const ardhja = document.getElementById("ardhjaForme");
const ikja = document.getElementById("ikjaForme");
const dhDizpozicion = document.getElementById("dhomatDizpozicSelc");
const dhomTeke = document.getElementById("dhomTekOpt");
const dhomCift = document.getElementById("dhomÇiftOpt");
const dhomFamil = document.getElementById("dhomFamilOpt");
const lekTotal = document.getElementById("totaliLek");

const roomsObj = {
  dhomFamiljare: 150,
  dhomCift: 120,
  dhomTeke: 100,
};

let llDhoms = llojIDhomes.toLowerCase();
let lekNata = roomsObj[llojIDhomes];

const autoComplete = () => {
  //Ndryshojme formatin InshaaAllah nese na duhet
  const pathMatch = value.match(/\d{4}|(?<=-0)\d|(?<=-)[^0]\d+/g);
  if (/\d+-\d+-\d+/g.test(checkIn.value)) {
    const datatA = checkIn[pathMatch];
    ardhja.value = `${datatA[1]}/${datatA[2]}/${datatA[0]}`; //muaj/dit/vit
  }
  if (/\d+-\d+-\d+/g.test(checkOut.value)) {
    const datatB = checkOut[pathMatch];
    ikja.value = `${datatB[1]}/${datatB[2]}/${datatB[0]}`;
  }
  selectTeRitur.value = adoleshent.value;
  selectFemije.value = femijet.value;
  dhDizpozicion.value = llDhoms;
  setTotali();
};

const setTotali = () => {
  lekTotal.innerText = `$${arrLength * lekNata}`;
};

export default autoComplete;

export const autoCompleteTek = () => {
  llDhoms = "dhomteke";
  dhDizpozicion.value = llDhoms;
  selectTeRitur.value = 1;
  selectFemije.value = 0;
};
export const autoCompleteCift = () => {
  llDhoms = "dhomcift";
  dhDizpozicion.value = llDhoms;
  selectTeRitur.value = 2;
  selectFemije.value = 0;
};
export const autoCompleteFamiljar = () => {
  llDhoms = "dhomfamiljare";
  dhDizpozicion.value = llDhoms;
  selectTeRitur.value = 2;
  selectFemije.value = 3;
};
//Ktu posht InshaaAllah shikoje nese nuk kam dhom ne dizpozicion ne kto data qe do zgjidhen
let dhTek = true;
let dhCift = true;
let dhFamil = true;
export const autofillDhomPerDatChange = (dat) => {
  let mj;
  //shikojm si i kemi muajt ardhje ikje

  if (ardhja.value.match(/\d+/)[0] == ikja.value.match(/\d+/)[0]) {
    if (ardhja.value.match(/\d+/)[0] == 6) {
      ditetQendrimitArrAutofill.forEach((el) => {
        nxirrDhomatShortcut("qershor", el, dat);
      });
    } else if (ardhja.value.match(/\d+/)[0] == 7) {
      ditetQendrimitArrAutofill.forEach((el) => {
        nxirrDhomatShortcut("korrig", el, dat);
      });
    } else if (ardhja.value.match(/\d+/)[0] == 8) {
      ditetQendrimitArrAutofill.forEach((el) => {
        nxirrDhomatShortcut("gusht", el, dat);
      });
    }
  } else if (
    ardhja.value.match(/\d+/)[0] == 6 &&
    ikja.value.match(/\d+/)[0] == 7
  ) {
    ditetQendrimitArrAutofill.forEach((el) => {
      nxirrDhomatShortcut((mj = "qershor"), el, dat);
      if (el == 30) {
        mj = "korrig";
      }
    });
  } else if (
    ardhja.value.match(/\d+/)[0] == 6 &&
    ikja.value.match(/\d+/)[0] == 8
  ) {
    ditetQendrimitArrAutofill.forEach((el) => {
      nxirrDhomatShortcut((mj = "qershor"), el, dat);
      if (el == 30) {
        mj = "korrig";
      }
      if (el == 31) {
        mj = "gusht";
      }
    });
  } else if (
    ardhja.value.match(/\d+/)[0] == 7 &&
    ikja.value.match(/\d+/)[0] == 8
  ) {
    ditetQendrimitArrAutofill.forEach((el) => {
      nxirrDhomatShortcut((mj = "korrig"), el, dat);
      if (el == 31) {
        mj = "gusht";
      }
    });
  }

  if (!dhTek) {
    dhomTeke.setAttribute("disabled", "");
  } else {
    dhomTeke.removeAttribute("disabled");
  }
  if (!dhCift) {
    dhomCift.setAttribute("disabled", "");
  } else {
    dhomCift.removeAttribute("disabled");
  }
  if (!dhFamil) {
    dhomFamil.setAttribute("disabled", "");
  } else {
    dhomFamil.removeAttribute("disabled");
  }

  dhTek = true;
  dhCift = true;
  dhFamil = true;
};

const nxirrDhomatShortcut = (muaj, nrm, dt) => {
  if (dt[0].muajt[muaj].datatDhomat[`dat${nrm}`] != null) {
    if (dt[0].muajt[muaj].datatDhomat[`dat${nrm}`].dhomTeke == 0) dhTek = false;
    if (dt[0].muajt[muaj].datatDhomat[`dat${nrm}`].dhomCift == 0)
      dhCift = false;
    if (dt[0].muajt[muaj].datatDhomat[`dat${nrm}`].dhomFamiljare == 0)
      dhFamil = false;
  } else {
    return;
  }
};
