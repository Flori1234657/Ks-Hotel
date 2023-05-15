//https://my-json-server.typicode.com/Flori1234657/js-project-server
import {
  scrollUp,
  scrollLeft,
  scrollRight,
  scrollTresh,
  rritNumrat,
} from "./animations.js";
import { mainBckground, a1, a2, a3 } from "./miniData.js";
import submitForm from "./utils/formSubmit.js";
import { lidhjaMeServerin, dizP } from "./utils/formSubmit.js";
import { getFirestoreDate } from "./components/jsDatepicker.js";
import autoComplete, {
  autoCompleteTek,
  autoCompleteCift,
  autoCompleteFamiljar,
} from "./utils/autoFillFields.js";
import {
  lejoKalim,
  lejoKalimin,
  fushatEvents,
} from "./utils/validateDizpozicion.js";

const hapMenun = document.getElementById("openMenu");
const nav = document.getElementById("naviFshehur");

const mainBck = document.querySelector(".main-section");
const img1 = document.getElementById("gallImg1");
const img2 = document.getElementById("gallImg2");
const img3 = document.getElementById("gallImg3");
const preloader = document.querySelector(".preloader-cont");

const karuseliImazheveTelefon = document.querySelector(".cont_photo_carusel");
const ndrroImazhBtn = document.getElementById("circleButon");

const forma = document.getElementById("forma");
const modali = document.getElementById("modal");
const rezervationForm = document.querySelector(".res_form_cont");
const anullBtn = document.getElementById("anulloFormBtn");

window.addEventListener("load", () => {
  document.body.removeChild(preloader);

  scrollUp();
  scrollLeft();
  scrollRight();
  scrollTresh();
  rritNumrat();
  getFirestoreDate();

  fushatEvents();
});

let togleNav = false;
hapMenun.addEventListener("click", () => {
  togleNav = !togleNav;
  togleNav ? (nav.style.display = "flex") : (nav.style.display = "none");
});

//Ndryshimi I Main-Section Background
function mainBckgChange() {
  const array = mainBckground;
  let final = array[Math.floor(Math.random() * (4 - 0) + 0)];
  mainBck.style.backgroundImage = `url(${final})`;
}
setInterval(() => {
  mainBckgChange();
}, 3000);

//Ndryshimi i imazheve te galeris
function galleryChange() {
  const array1 = a1;
  const array2 = a2;
  const array3 = a3;

  let final1 = array1[Math.floor(Math.random() * (5 - 0) + 0)];

  let final2 = array2[Math.floor(Math.random() * (5 - 0) + 0)];

  let final3 = array3[Math.floor(Math.random() * (5 - 0) + 0)];

  if (final1 === final2 || final2 === final3 || final1 === final3) {
    return;
  } else {
    img1.removeAttribute("src");
    img1.setAttribute("src", `${final1}`);
    img2.removeAttribute("src");
    img2.setAttribute("src", `${final2}`);
    img3.removeAttribute("src");
    img3.setAttribute("src", `${final3}`);
  }
}
setInterval(() => {
  galleryChange();
}, 3000);

let rritNr = 0;
ndrroImazhBtn.addEventListener("click", () => {
  const array = a1;
  if (rritNr == array.length - 1) {
    rritNr = 0;
    karuseliImazheveTelefon.style.backgroundImage = `url(${array[rritNr]})`;
  } else {
    rritNr += 1;
    karuseliImazheveTelefon.style.backgroundImage = `url(${array[rritNr]})`;
  }
});

//Dizpozicion Function

forma.addEventListener("submit", async (e) => {
  e.preventDefault();
  lejoKalim();
  if (lejoKalimin) {
    modali.showModal();
    modali.style.backgroundColor = "transparent";
    document.querySelector(".loader").style.display = "flex";
    rezervationForm.style.display = "none";
    await submitForm().then(() => shfqRezrv());
  } else {
    return;
  }
});

//Shfaq Rezervimin nga forma praprake
const shfqRezrv = () => {
  document.querySelector(".loader").style.display = "none";
  modali.style.backgroundColor = "white";
  if (!lidhjaMeServerin) {
    document.querySelector(".errorMsg").style.display = "flex";

    return;
  }
  rezervationForm.style.display = "flex";
  const gjendja = document.querySelector(".kaOseSkaGjendje");

  if (dizP) {
    gjendja.style.display = "block";
    gjendja.style.color = "#00b400";
    gjendja.innerText = "Kërkesa juaj është në gjëndje";
    autoComplete();
    setTimeout(() => {
      gjendja.style.display = "none";
    }, 4000);
  } else {
    gjendja.style.display = "block";
    gjendja.style.color = "#b40000";
    gjendja.innerText = "Kërkesa juaj nuk është në gjëndje";
    setTimeout(() => {
      gjendja.style.display = "none";
    }, 4000);
  }
};
//Shfaq rezervimin per butona te ndryshem
document.getElementById("rezNow").addEventListener("click", () => {
  shfaqRezervMinFunc();
});
document.getElementById("rooms-rztek").addEventListener("click", () => {
  shfaqRezervMinFunc();
  autoCompleteTek();
});
document.getElementById("cards-rzvtek").addEventListener("click", () => {
  shfaqRezervMinFunc();
  autoCompleteTek();
});
document.getElementById("rooms-rzcift").addEventListener("click", () => {
  shfaqRezervMinFunc();
  autoCompleteCift();
});
document.getElementById("cards-rzvcift").addEventListener("click", () => {
  shfaqRezervMinFunc();
  autoCompleteCift();
});
document.getElementById("rooms-rzfamiljar").addEventListener("click", () => {
  shfaqRezervMinFunc();
  autoCompleteFamiljar();
});
document.getElementById("cards-rzvfamiljar").addEventListener("click", () => {
  shfaqRezervMinFunc();
  autoCompleteFamiljar();
});

const shfaqRezervMinFunc = () => {
  document.querySelector(".loader").style.display = "none";
  modali.style.backgroundColor = "white";
  modali.showModal();
  rezervationForm.style.display = "flex";
};
anullBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modali.close();
});
