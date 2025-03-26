// ============ HTML elements
// контейнер з постами 
const containerPostsElem = document.getElementById('containerPosts');
// загрузичне вікно
const loadPageElm = document.getElementById('load-page')

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageButtonsElem = document.getElementById('page-buttons');


// ========== змінні
// масив з постами
let posts = [];
// масив з постами але відфільтрований
let postsFilter = [];
// номер поточної сторінки
let courentPage = 1;
// кількість постів на сторінці
const postsPerPage = 10;
// загальна кількість сторінок
let totalPages = 1;

// отримання пстів по API 
async function getPosts(){
  const url = 'https://jsonplaceholder.typicode.com/posts';
  const response = await fetch(url);
  if(response){
    posts = await response.json();
    postsFilter = [...posts];
    loadPageClose();
  }else{
    containerPostsElem.innerHTML = `No posts found!!!`
  }
  renderPostsToContainerPosts();
}

getPosts();

// рендер постів 
function renderPostsToContainerPosts(){
  containerPostsElem.innerHTML = '';
  const start = (courentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const pageContainer = postsFilter.slice(start, end);
  pageContainer.forEach(post =>{
    const postElm = document.createElement('div');
    postElm.classList.add('post');
    postElm.innerHTML= `
    <h2>${post.title}</h2>
    <p>${post.body}</p>
    `
    containerPostsElem.appendChild(postElm);
  })
  
  totalPages = Math.ceil(postsFilter.length / postsPerPage);

  const courentPageElm = document.createElement('div');
  courentPageElm.classList.add('courent-page');
  courentPageElm.innerHTML = `
    <h2>Page ${courentPage} of ${totalPages}</h2>
  `;
  containerPostsElem.appendChild(courentPageElm);

  renderPagination();
  pageContainer.length = 0;
}

// рендер пагінації
function renderPagination(){
  pageButtonsElem.innerHTML = '';
  let pagesBefore = 3;
  let pagesAfter = 3;
  let startPage = courentPage - pagesBefore;
  if(startPage < 1) startPage = 1;
  let endPage = startPage + (pagesBefore + pagesAfter);
  if(endPage >= totalPages) {
    endPage = totalPages;
    if(totalPages > (pagesBefore + pagesAfter))
    startPage = endPage - (pagesBefore + pagesAfter);
  }
  for (let i = startPage; i <= endPage; i++){
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.classList.add('page-btn');

    if(i == courentPage){
      pageBtn.classList.add('active')
    }
    pageBtn.addEventListener('click', ()=>{
      courentPage = i;
      renderPostsToContainerPosts();
    })
    pageButtonsElem.appendChild(pageBtn);
  }
  
  prevBtn.disabled = courentPage == 1;
  nextBtn.disabled = courentPage == totalPages;
}

prevBtn.addEventListener('click', ()=>{
  if(courentPage > 1){
    courentPage--;
    renderPostsToContainerPosts();
  }
})

nextBtn.addEventListener('click', ()=>{
  if(courentPage < totalPages){
    courentPage++;
    renderPostsToContainerPosts();
  }
})

function loadPageClose(){
  loadPageElm.classList.add('load-page-close');
}