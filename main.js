const input = document.querySelector('.search'); // тег input
const searchField = document.querySelector('.search-field'); // Поле с вариантами поиска
const resultList = document.querySelector('.result-list');// Блок с розовыми результатами
const searchList = document.querySelector('.search-list');

const perPage = 5;// колво выпадающих результатов

let repositaries = []; //Массив для найденных репозитариев

//Функция задержки отправки запросаДебаунс
function debounce(func, timeout){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

//Функция Создания элемента
function createElem (tag, elemClass, text) {
    const element = document.createElement(tag);
    if(elemClass) element.classList.add(elemClass);
    if(text) element.textContent = text;
    return element;
}

//Функция показа вариантов
function viewVariants(response){
    if(input.value){
    clearSearchList(); // Очищаем результаты предыдущего запроса
   
    for(let repos of response.items){
        let elem = createElem('li','search-list__item', repos['name'])// Создаём элемент ли
        elem.setAttribute('id',`${repos.id}`) // Добавляем элементу списка атрибут ID
        searchList.appendChild(elem) //добавляем элемент в Список

        repositaries.push(repos);//добавляем инфу о репозитарии в массив
    }
    console.log(repositaries);
  } 
}

//Функция очистки списка вариантов
function clearSearchList (){
    searchList.innerHTML = ''; //Очищаем отображение на странице
    repositaries = []; //обнуляем массив с инфой о репозитариях
}

//Функция отправки запроса на GitHub
async function searchRep(){
    if(input.value && input.value[0] !== ' ') {
    return await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=${perPage}`)
    .then( response => {
          if(response.ok){ // Если статус успешный
            response.json().then(viewVariants) // Запускаем функцию показа вариантов при статусе ОК
          } else {
            console.log(response.status);
          }
        }).catch((err)=>{
            console.log(err);
        })

    } else {
        // Очищаем результаты поиска если поисковая строка пуста
        input.value = '';
        clearSearchList();
    } 
}

/*-----------------------Закрепление результатов---------------------------*/

function selectRep(repos){
    console.log(repos)
 let element = createElem('li','result-list__item');
 let elemInfo = createElem ('ul', 'element-info');

 let elemName = createElem('li','items',`Name: ${repos['name']}`); //Имя
 elemInfo.appendChild(elemName);

 let elemOwner = createElem('li','items',`Owner: ${repos['owner']["login"]}`); //Owner
 elemInfo.appendChild(elemOwner);

 let elemStars = createElem('li','items',`Stars: ${repos["stargazers_count"]}`); //Stars
 elemInfo.appendChild(elemStars);

 let closeButton = createElem('button', 'close-button'); //кнопка закрытия

 element.appendChild(elemInfo);
 element.appendChild(closeButton);
 resultList.appendChild(element);
}

/*---------------------СОБЫТИЯ-----------------------*/

//событие при нажатии клавиш в строке поиска
input.addEventListener('keyup', debounce(searchRep, 600));

//Событие клик по найденному варианту
searchField.addEventListener('click',(event)=>{
    for( let repos of repositaries){
        if(event.target.id == repos['id']){
            selectRep(repos); //добавляем розовую карточку с инфой о репозитарии
            input.value = ''; // очищаем строчку ввода
            clearSearchList(); // очищаем найденные варианты
        }
    }
})

//Зыкрытие розовой карточки с инфой о репозитарии
resultList.addEventListener('click', function(event){
    if(event.target.classList[0] === 'close-button') { //класс элемента равен close-button
        event.target.parentElement.remove() // удаляй элемент
    }
})