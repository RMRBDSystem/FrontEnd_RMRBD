export const convertYoutubeLink = (link) => {
  const iframe = document.getElementById('iframe');
  const id = link.split('?v=')[1];
  const newLink = `https://www.youtube.com/embed/${id}`;
  iframe.src = newLink;
};

export const innerMenu = () => {
  const tabContent = document.querySelectorAll('.container__inner');
  const tabItem = document.querySelectorAll('.container__item');

  document.querySelector(".container__list").addEventListener("mouseover", (e) => {
    if (e.target && e.target.matches(".container__item")) {
      const index = [...tabItem].indexOf(e.target);
      tabContent.forEach((item) => item.classList.add("container__inner_hidden"));
      tabItem.forEach((item) => item.classList.remove("container__item_active"));
      tabContent[index].classList.remove("container__inner_hidden");
      tabItem[index].classList.add("container__item_active");
    }
  });
  
};
