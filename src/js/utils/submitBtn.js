import {
  ardhja,
  ikja,
  ditetQendrimitArrAutofill,
  selectFemije,
  selectTeRitur,
  dhDizpozicion,
  emri,
  mbiemri,
  email,
  telefon,
  lekTotal,
} from "./validateDizpozicion";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
const modali = document.getElementById("modal");
let id;

export const dergoObjektin = async () => {
  document.getElementById("afterSbmDil").addEventListener("click", () => {
    location.reload();
  });
  document.getElementById("ringarko").addEventListener("click", () => {
    location.reload();
  });
  document.querySelector(".res_form_cont").style.display = "none";
  modali.style.backgroundClip = "transparent";
  document.querySelector(".ldr").style.display = "block";

  id = `${ardhja.value.match(/\d+/g)}-${ikja.value.match(/\d+/g)}`;
  const rezervimi = {
    idja: id,
    emri: emri.value,
    mbiemri: mbiemri.value,
    persona: {
      femij: selectFemije.value,
      teRritur: selectTeRitur.value,
    },
    ditaArdjhes: ardhja.value,
    ditaIkjes: ikja.value,
    email: email.value,
    telefon: telefon.value,
    dhoma: dhDizpozicion.value,
    ditetEQendrimitL: ditetQendrimitArrAutofill,
    perTuPaguar: lekTotal.innerHTML,
    pranuar: false,
  };
  try {
    await addDoc(collection(db, "Rezervimet"), rezervimi).then(() => {
      document.querySelector(".ldr").style.display = "none";
      document.querySelector(".aftr_ldr").style.display = "flex";
    });
  } catch (error) {
    console.log(error);
    alert("Pati një problem ju lutem provoni më vonë");
    location.reload();
  }
};
