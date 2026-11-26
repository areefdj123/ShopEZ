const heroSection = document.querySelector(".hero");
const headphoneImg = document.querySelector("#mainimg");

if (heroSection && headphoneImg) {
  headphoneImg.style.transition = "transform 0.15s ease-out";

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    headphoneImg.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.05)`;
  });

  heroSection.addEventListener("mouseleave", () => {
    headphoneImg.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
  });
}

async function getData(){
  let i = await fetch("./js/data/product.js")
  let data = i.json()
  return data
}

async function main(){
  let data = await getData()
  console.log(data);
  
}
main()