//Statistikat me numra
const njerezTeKenaqur = document.getElementById("njTeKenaq");
const njerezTeRinj = document.getElementById("njTeRinj");
const vlersuarMe5Yje = document.getElementById("vlrMePesYj");
const rezervimeOnline = document.getElementById("rezOnline");

export const scrollUp = () => {
  const observerUp = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("addUp");
        }
      });
    },
    {
      threshold: 1.0,
    }
  );

  const animUp = document.querySelectorAll(".up");
  animUp.forEach((el) => observerUp.observe(el));
};
export const scrollLeft = () => {
  const observerUp = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("addLeft");
        }
      });
    },
    {
      threshold: 1.0,
    }
  );

  const animUp = document.querySelectorAll(".left");
  animUp.forEach((el) => observerUp.observe(el));
};
export const scrollRight = () => {
  const observerUp = new IntersectionObserver((entries) => {
    entries.forEach(
      (entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("addRight");
        }
      },
      {
        threshold: 1.0,
      }
    );
  });

  const animUp = document.querySelectorAll(".right");
  animUp.forEach((el) => observerUp.observe(el));
};
export const scrollTresh = () => {
  const observerUp = new IntersectionObserver((entries) => {
    entries.forEach(
      (entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("addTresh");
        }
      },
      {
        threshold: 1.0,
      }
    );
  });

  const animUp = document.querySelectorAll(".imazhs");
  animUp.forEach((el) => observerUp.observe(el));
};

//RRITJA E NUMRAVE
export const rritNumrat = () => {
  const observerUp = new IntersectionObserver((entries) => {
    entries.forEach(
      (entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("shfaq");
          //Rritja e numrave
          let numri = 1;
          let numri2 = 1;
          let numri3 = 1;
          let numri4 = 1;

          const intervalNumr = setInterval(() => {
            numri += 112;
            numri2 += 57;
            numri3 += 89;
            numri4 += 49;
            njerezTeKenaqur.innerText = `${numri}+`;
            njerezTeRinj.innerText = `${numri2}+`;
            vlersuarMe5Yje.innerText = `${numri3}+`;
            rezervimeOnline.innerText = `${numri4}+`;

            stopIntervat();
          }, 100);
          const stopIntervat = () => {
            if (
              numri >= 2925 &&
              numri2 >= 1200 &&
              numri3 >= 2532 &&
              numri4 >= 1120
            ) {
              clearInterval(intervalNumr);
            } else {
              return;
            }
          };
        }
      },
      {
        threshold: 1.0,
      }
    );
  });

  const animUp = document.querySelectorAll(".numratHiden");
  animUp.forEach((el) => observerUp.observe(el));
};
