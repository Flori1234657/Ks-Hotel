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

  if (/\d+-\d+-\d+/g.test(checkIn.value)) {
    const datatA = checkIn.value.match(/\d{4}|(?<=-0)\d|(?<=-)[^0]\d+/g);
    ardhja.value = `${datatA[1]}/${datatA[2]}/${datatA[0]}`; //muaj/dit/vit
  }
  if (/\d+-\d+-\d+/g.test(checkOut.value)) {
    const datatB = checkOut.value.match(/\d{4}|(?<=-0)\d|(?<=-)[^0]\d+/g);
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
  const ardhjPath = ardhja.value.match(/\d+/)[0];
  const ikjPath = ikja.value.match(/\d+/)[0];

  const shortObj = {
    emrMuaj: {
      6: "qershor",
      7: "korrig",
      8: "gusht",
    },
  };

  ditetQendrimitArrAutofill.forEach((el) => {
    if (ardhjPath == ikjPath)
      nxirrDhomatShortcut(shortObj.emrMuaj[ardhjPath], el, dat);

    if (ardhjPath == 6 && ikjPath == 7) {
      let mj = "qershor";
      nxirrDhomatShortcut(mj, el, dat);
      el == 30 && mj == "qershor" ? (mj = "korrig") : "";
    }
    if (ardhjPath == 7 && ikjPath == 8) {
      let mj = "korrig";
      nxirrDhomatShortcut(mj, el, dat);
      el == 31 && mj == "korrig" ? (mj = "gusht") : "";
    }
    if (ardhjPath == 6 && ikjPath == 7) {
      let mj = "qershor";
      nxirrDhomatShortcut(mj, el, dat);
      el == 30 && mj == "qershor" ? (mj = "korrig") : "";
      el == 31 && mj == "korrig" ? (mj = "gusht") : "";
    }
  });

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
  const path = dt[0].muajt[muaj].datatDhomat[`dat${nrm}`];
  if (path != null) {
    path.dhomTeke == 0 ? (dhTek = false) : "";
    path.dhomCift == 0 ? (dhCift = false) : "";
    path.dhomFamiljare == 0 ? (dhFamil = false) : "";
  } else {
    return;
  }
};
