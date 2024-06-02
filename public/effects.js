const sections = [document.querySelector('.hero1'), document.querySelector('.hero2'), document.querySelector('.hero3')]
const cards = document.querySelectorAll('.cards')
const about = document.querySelectorAll('.wrapper-about')

window.addEventListener('scroll', scrollEffect1);
window.addEventListener('scroll', scrollEffect2);
window.addEventListener('scroll', scrollEffect3);
scrollEffect1()
scrollEffect2()
scrollEffect3()
function scrollEffect1(){
    const height = window.innerHeight / 1.2;

    sections.forEach((section) =>{
        const top = section.getBoundingClientRect().top

        if(top<height){
            section.classList.add('show')
        }else{
            section.classList.remove('show')
        }
    });

    
}

function scrollEffect2(){
    const height = window.innerHeight / 1.4;
    about.forEach((section) =>{
        const top = section.getBoundingClientRect().top

        if(top<height){
            section.classList.add('show')
        }else{
            section.classList.remove('show')
        }
    });
}

function scrollEffect3(){
    const height = window.innerHeight / 1.4;
    cards.forEach((section) =>{
        const top = section.getBoundingClientRect().top

        if(top<height){
            section.classList.add('show')
        }else{
            section.classList.remove('show')
        }
    });
}