import { collection, doc, getDocs } from "firebase/firestore";
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

const submitForm = async () => {
  const datObj = {
    fillim: checkIn.value.match(/(?<=-0)\d|(?<=-)[^0]\d+/g), //[2,11] shembull
    mbarim: checkOut.value.match(/(?<=-0)\d|(?<=-)[^0]\d+/g), //[muaj,data]
    adults: adoleshent.value,
    femij: femijet.value,
  };

  const dataFiltruar = {
    ardhja: {
      data: datObj.fillim[1],
      muaj: datObj.fillim[0],
    },
    ikja: {
      data: datObj.mbarim[1],
      muaj: datObj.mbarim[0],
    },
  };

  //Ndryshim nga numra ne muaj me emer dhe heqja e zerove para numrave
  if (dataFiltruar.ardhja.muaj == "6") {
    dataFiltruar.ardhja.muaj = "qershor";
  } else if (dataFiltruar.ardhja.muaj == "7") {
    dataFiltruar.ardhja.muaj = "korrig";
  } else if (dataFiltruar.ardhja.muaj == "8") {
    dataFiltruar.ardhja.muaj = "gusht";
  }

  if (dataFiltruar.ikja.muaj == "6") {
    dataFiltruar.ikja.muaj = "qershor";
  } else if (dataFiltruar.ikja.muaj == "7") {
    dataFiltruar.ikja.muaj = "korrig";
  } else if (dataFiltruar.ikja.muaj == "8") {
    dataFiltruar.ikja.muaj = "gusht";
  }

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
    } else if (Number(datObj.adults) == 2 && Number(datObj.femij) == 0) {
      llojIDhomes = "dhomCift";
    } else if (Number(datObj.adults) == 1 && Number(datObj.femij) == 0) {
      llojIDhomes = "dhomTeke";
    } else if (Number(datObj.adults) > 2 && Number(datObj.femij) == 0) {
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

        const datQendrimitArr = [];

        //INSHAAALLAH sigurohemi qe mos te zgjedhin datat gabim
        //31 gushti|30 qershor|31 korrigu
        if (dataFiltruar.ardhja.muaj != dataFiltruar.ikja.muaj) {
          if (
            /qershor/g.test(dataFiltruar.ardhja.muaj) &&
            /korrig/g.test(dataFiltruar.ikja.muaj)
          ) {
            checkSubmitFunc(
              dataArdhjes,
              dataIkjes,
              datQendrimitArr,
              el,
              dataFiltruar,
              "q-k",
              llojIDhomes
            );
          } else if (
            (/gusht|korrig/g.test(dataFiltruar.ardhja.muaj) &&
              /qershor/g.test(dataFiltruar.ikja.muaj)) ||
            (/gusht/g.test(dataFiltruar.ardhja.muaj) &&
              /korrig/g.test(dataFiltruar.ikja.muaj))
          ) {
            dizP = false;
            alert("Ju lutem shikojini dhe njëher datat"); //Ktu InshaaAllah duhet te bej qe te dali nje mesazh ne UI
          } else if (
            /korrig/g.test(dataFiltruar.ardhja.muaj) &&
            /gusht/g.test(dataFiltruar.ikja.muaj)
          ) {
            checkSubmitFunc(
              dataArdhjes,
              dataIkjes,
              datQendrimitArr,
              el,
              dataFiltruar,
              "k-g",
              llojIDhomes
            );
          } else if (
            /qershor/g.test(dataFiltruar.ardhja.muaj) &&
            /gusht/g.test(dataFiltruar.ikja.muaj)
          ) {
            checkSubmitFunc(
              dataArdhjes,
              dataIkjes,
              datQendrimitArr,
              el,
              dataFiltruar,
              "q-g",
              llojIDhomes
            );
          }
        } else if (
          dataFiltruar.ardhja.muaj == dataFiltruar.ikja.muaj &&
          Number(dataArdhjes) < Number(dataIkjes)
        ) {
          checkSubmitFunc(
            dataArdhjes,
            dataIkjes,
            datQendrimitArr,
            el,
            dataFiltruar,
            "thjesht",
            llojIDhomes
          );
        } else if (
          dataFiltruar.ardhja.muaj == dataFiltruar.ikja.muaj &&
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
  if (lloji == "q-k") {
    //bejme llojet qe na duhen ne varsi te lidhjes te muajve
    for (let i = Number(ardhja); i <= 30; i++) {
      //Tani InshaaAllah fusim renditjen e duhur te datave ne array
      arr.push(i);
    }
    for (let i = 1; i <= Number(ikja); i++) {
      arr.push(i);
    }
  } else if (lloji == "thjesht") {
    for (let i = Number(ardhja); i <= Number(ikja); i++) {
      arr.push(i);
    }
  } else if (lloji == "k-g") {
    for (let i = Number(ardhja); i <= 31; i++) {
      arr.push(i);
    }
    for (let i = 1; i <= Number(ikja); i++) {
      arr.push(i);
    }
  } else if (lloji == "q-g") {
    for (let i = Number(ardhja); i <= 30; i++) {
      arr.push(i);
    }
    for (let i = 1; i <= 31; i++) {
      arr.push(i);
    }
    for (let i = 1; i <= Number(ikja); i++) {
      arr.push(i);
    }
  }

  //Tani shikojme nese kemi hyrje te lira midis ketyre datave InshaaAllah
  dizP = true;
  arr.forEach((nr) => {
    if (
      el.muajt[`${dataFiltruar.ardhja.muaj}`].datatDhomat[`dat${nr}`] == null
    ) {
      dizP = false;
      arrLength = arr.length;
      lidhjaMeServerin = true;
      ardhjaFrm.value = "";
      ikjaFrm.value = "";
      lekTotal.innerText = "$0";
      dhomatSelect.value = "zgjidh";
      return;
    }

    if (
      el.muajt[`${dataFiltruar.ardhja.muaj}`].datatDhomat[`dat${nr}`][
        `${llojiDhomes}`
      ] == 0
    ) {
      dizP = false;
    }
    if (
      dataFiltruar.ardhja.muaj == "qershor" &&
      /korrig|gusht/.test(dataFiltruar.ikja.muaj) &&
      nr == 30
    ) {
      dataFiltruar.ardhja.muaj = "korrig";
    } else if (
      dataFiltruar.ardhja.muaj == "korrig" &&
      dataFiltruar.ikja.muaj == "gusht" &&
      nr == 31
    ) {
      dataFiltruar.ardhja.muaj = "gusht";
    }
  });

  console.log("FINALJA MBAS LUFTES ME KODIN " + dizP);

  arrLength = arr.length;
};

export default submitForm;
