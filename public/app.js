const menuBtn = document.getElementById("menu-btn");

menuBtn.addEventListener("click", function() {
  const menuScreen = document.getElementById('menu-screen');
  if (menuScreen.style.height){
    menuScreen.style.height = null;
  } else {
    menuScreen.style.height = '100vh';
  } 
});
