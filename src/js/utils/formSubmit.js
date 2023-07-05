import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase.js";

export const checkIn = document.getElementById("datFillim");
export const checkOut = document.getElementById("datMbarim");
export const adoleshent = document.getElementById("adoleshenta");
export const femijet = document.getElementById("femije");
const lekTotal = document.getElementById("totaliLek");
const dhomatSelect = document.getElementById("dhomatDizpozicSelc");
const ardhjaFrm = document.getElementById("ardhjaForme");
const ikjaFrm = document.getElementById("ikjaForme");

export let dizP = false;
export let lidhjaMeServerin = false;
export let llojIDhomes = "";
export let arrLength = "";

const datSot = new Date();

const submitForm = async () => {
  const datObj = {
    fillim: checkIn.value.match(/(?<=-0)\d|(?<=-)[^0]\d+/g), //[2,11] shembull
    mbarim: checkOut.value.match(/(?<=-0)\d|(?<=-)[^0]\d+/g), //[muaj,data]
    adults: adoleshent.value,
    femij: femijet.value,
  };

  const muajMeEmrObj = {
    6: "qershor",
    7: "korrig",
    8: "gusht",
  };

  const dataFiltruar = {
    ardhja: {
      data: datObj.fillim[1],
      muaj: muajMeEmrObj[datObj.fillim[0]],
    },
    ikja: {
      data: datObj.mbarim[1],
      muaj: muajMeEmrObj[datObj.mbarim[0]],
    },
  };

  const dataSot = `${datSot.getDate()}${
    datSot.getMonth() + 1
  }${datSot.getFullYear()}`;
  const ardhjaFull = `${datObj.fillim[1]}${
    datObj.fillim[0]
  }${datSot.getFullYear()}`;

  //Dmth nese personi ka zgjedhur nje dat qe eshte mbas dates se sotme mbyllim funksionin InshaaAllah
  if (Number(datSot) >= Number(ardhjaFull)) {
    dizP = false;
    lidhjaMeServerin = true; //qe mos te na japi error
    return;
  } else {
    try {
      const docs = await getDocs(collection(db, "Dizpozicioni")).then((dc) => {
        lidhjaMeServerin = true;

        return dc.docs.map((el) => {
          return el.data();
        });
      });

      //Tani InshaaAllah shikojme se cila lloj dhome na duhet
      if (Number(datObj.adults) >= 1 && Number(datObj.femij) >= 1) {
        llojIDhomes = "dhomFamiljare";
      } else if (Number(datObj.adults) === 2 && Number(datObj.femij) === 0) {
        llojIDhomes = "dhomCift";
      } else if (Number(datObj.adults) === 1 && Number(datObj.femij) === 0) {
        llojIDhomes = "dhomTeke";
      } else if (Number(datObj.adults) > 2 && Number(datObj.femij) === 0) {
        llojIDhomes = "dhomFamiljare";
      }

      docs.forEach((el) => {
        //kemi vetem nje dokument
        if (
          /(gusht)|(korrig)|(qershor)/g.test(dataFiltruar.ardhja.muaj) &&
          /(gusht)|(korrig)|(qershor)/g.test(dataFiltruar.ikja.muaj)
        ) {
          const dataArdhjes = dataFiltruar.ardhja.data;
          const dataIkjes = dataFiltruar.ikja.data;
          const muajArdhjes = dataFiltruar.ardhja.muaj;
          const muajIkjes = dataFiltruar.ikja.muaj;

          const datQendrimitArr = [];

          const checkSubmit = (lloj) => {
            checkSubmitFunc(
              dataArdhjes,
              dataIkjes,
              datQendrimitArr,
              el,
              dataFiltruar,
              lloj,
              llojIDhomes
            );
          };

          //INSHAAALLAH sigurohemi qe mos te zgjedhin datat gabim
          //31 gushti|30 qershor|31 korrigu
          if (muajArdhjes != muajIkjes) {
            if (muajArdhjes === "qershor" && muajIkjes === "korrig") {
              checkSubmit("q-k");
            } else if (
              (/gusht|korrig/g.test(muajArdhjes) &&
                /qershor/g.test(muajIkjes)) ||
              (/gusht/g.test(muajArdhjes) && /korrig/g.test(muajIkjes))
            ) {
              dizP = false;
              alert("Ju lutem shikojini dhe njëher datat"); //Ktu InshaaAllah duhet te bej qe te dali nje mesazh ne UI
            } else if (
              /korrig/g.test(muajArdhjes) &&
              /gusht/g.test(muajIkjes)
            ) {
              checkSubmit("k-g");
            } else if (
              /qershor/g.test(muajArdhjes) &&
              /gusht/g.test(muajIkjes)
            ) {
              checkSubmit("q-g");
            }
          } else if (
            muajArdhjes == muajIkjes &&
            Number(dataArdhjes) < Number(dataIkjes)
          ) {
            checkSubmit("thjesht");
          } else if (
            muajArdhjes == muajIkjes &&
            Number(dataArdhjes) > Number(dataIkjes)
          ) {
            dizP = false;
            alert("Ju Lutem Shenoni Datat Sakte"); //Ktu InshaaAllah duhet te bej qe te dali nje mesazh ne UI
          }
        } else {
          dizP = false;
        }
      });
    } catch (error) {
      console.log(error);
      lidhjaMeServerin = false;
      return;
    }
  }
};

const futDitetEQendrimit = (lloji, ardh, ikj, arr) => {
  if (lloji == "thjesht") {
    arr.push(ardh);
    if (ardh == ikj) return;
    futDitetEQendrimit(lloji, Number(ardh) + 1, ikj, arr);
  }

  if (lloji == "q-k") {
    arr.push(ardh);
    ardh == 30
      ? futDitetEQendrimit("thjesht", 1, ikj, arr)
      : futDitetEQendrimit(lloji, Number(ardh) + 1, ikj, arr);
  }

  if (lloji == "k-g") {
    arr.push(ardh);
    ardh == 31
      ? futDitetEQendrimit("thjesht", 1, ikj, arr)
      : futDitetEQendrimit(lloji, Number(ardh) + 1, ikj, arr);
  }

  if (lloji == "q-g") {
    arr.push(ardh);
    ardh == 30
      ? futDitetEQendrimit("k-g", 1, ikj, arr)
      : futDitetEQendrimit(lloji, Number(ardh) + 1, ikj, arr);
  }
};

const checkSubmitFunc = (
  ardhja,
  ikja,
  arr,
  el,
  dataFiltruar,
  lloji,
  llojiDhomes
) => {
  futDitetEQendrimit(lloji, ardhja, ikja, arr);

  //Tani shikojme nese kemi hyrje te lira midis ketyre datave InshaaAllah
  dizP = true;
  let datFiltruar = JSON.parse(JSON.stringify(dataFiltruar.ardhja.muaj));

  arr.forEach((nr) => {
    const path =
      el.muajt[`${dataFiltruar.ardhja.muaj}`].datatDhomat[`dat${nr}`];

    if (path == null) {
      dizP = false;
      arrLength = arr.length;
      lidhjaMeServerin = true;
      ardhjaFrm.value = "";
      ikjaFrm.value = "";
      lekTotal.innerText = "$0";
      dhomatSelect.value = "zgjidh";
      return;
    }

    if (path[`${llojiDhomes}`] == 0) dizP = false;

    if (
      datFiltruar == "qershor" &&
      /korrig|gusht/.test(dataFiltruar.ikja.muaj) &&
      nr == 30
    ) {
      datFiltruar = "korrig";
    } else if (
      datFiltruar == "korrig" &&
      dataFiltruar.ikja.muaj == "gusht" &&
      nr == 31
    ) {
      datFiltruar = "gusht";
    }
  });
  arrLength = arr.length;
};

export default submitForm;
