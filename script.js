const topPage = document.querySelector('.top-page');
const centerPage = document.querySelector('.center-page');
const rightPage = document.querySelector('.right-page');
const leftPage = document.querySelector('.left-page');
const leftButton = document.querySelectorAll('.button-left');
const rightButton = document.querySelectorAll('.button-right');
const topButton = document.querySelector('.button-top');
const bottomButton = document.querySelector('.button-bottom');
const projects = document.querySelectorAll('.project');
const cards = document.querySelectorAll('.card');
const previews = document.querySelectorAll('.preview-button');
const pages = document.querySelectorAll('.page');
const goEmail = document.querySelector('.go-email');
const copyEmail = document.querySelector('.email-copy');
const pagesWrapper = document.querySelector('.pages-wrapper');
const musicButton = document.querySelectorAll('.music-container');
const musicSvg = document.querySelectorAll('.music-path');
const body = document.querySelector('body');
const loadingDiv = document.querySelector('.loading-div');
const loadingBar = document.querySelector('.loading-bar');

let scene, camera, renderer, stars, starGeo, starMaterial;

let state = 'up';

init();
animate();

function init() {
   const loadingManager = new THREE.LoadingManager(
      () => {
         window.setTimeout(() => {
            loadingBar.classList.add('ended');
            loadingBar.style.transform = '';
         }, 500);
         window.setTimeout(() => {
            musicButtonFading();
            loadingDiv.classList.add('ended');
         }, 1800);
      },
      (_, itemsLoaded, itemsTotal) => {
         const progressRatio = itemsLoaded / itemsTotal;
         loadingBar.style.transform = `scaleX(${progressRatio})`;
      }
   );

   renderer = new THREE.WebGLRenderer();
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);

   camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
   );
   camera.position.z = 1;
   camera.rotation.x = Math.PI / 2;

   scene = new THREE.Scene();

   starGeo = new THREE.Geometry();
   for (let i = 0; i < 6000; i++) {
      star = new THREE.Vector3(
         Math.random() * 600 - 300,
         Math.random() * 600 - 300,
         Math.random() * 600 - 300
      );
      star.velocity = 0;
      star.acceleration = 0.00005;
      starGeo.vertices.push(star);
   }

   let sprite = new THREE.TextureLoader(loadingManager).load('star.svg');
   starMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.8,
      map: sprite
   });

   stars = new THREE.Points(starGeo, starMaterial);
   scene.add(stars);

   // const axesHelper = new THREE.AxesHelper(5);
   // scene.add(axesHelper);

   window.addEventListener('resize', onWindowResize, false);

   animate();
}

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
   starGeo.vertices.forEach(p => {
      p.velocity += p.acceleration;
      p.y -= p.velocity;

      if (p.y < -200) {
         p.y = 200;
         p.velocity = 0;
      }
   });
   starGeo.verticesNeedUpdate = true;
   stars.rotation.y += 0.0005;
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

   // updateCamera();
   TWEEN.update();
   renderer.render(scene, camera);
   requestAnimationFrame(animate);
}

function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
}

// function onDocumentMouseMove(event) {
//    event.preventDefault();
//    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

const setColor = () => {
   const upColor = new THREE.Color(0xaaaaaa);
   const centerColor = new THREE.Color(0xff6bf8);
   const leftColor = new THREE.Color(0x84bde4);
   const rightColor = new THREE.Color(0x9fd8cb);

   if (state === 'up') {
      const tween = new TWEEN.Tween(starMaterial.color)
         .to(upColor, 500)
         .easing(TWEEN.Easing.Quadratic.Out)
         .start();
      document.documentElement.style.cssText = `
      --state-color: #fff;`;
   } else if (state === 'right') {
      const tween = new TWEEN.Tween(starMaterial.color)
         .to(rightColor, 500)
         .easing(TWEEN.Easing.Quadratic.Out)
         .start();
      document.documentElement.style.cssText = `
         --state-color: #9fd8cb;`;
   } else if (state === 'left') {
      const tween = new TWEEN.Tween(starMaterial.color)
         .to(leftColor, 500)
         .easing(TWEEN.Easing.Quadratic.Out)
         .start();
      document.documentElement.style.cssText = `
         --state-color: #84bde4;`;
   } else if (state === 'center') {
      const tween = new TWEEN.Tween(starMaterial.color)
         .to(centerColor, 500)
         .easing(TWEEN.Easing.Quadratic.Out)
         .start();
      document.documentElement.style.cssText = `
         --state-color: #ff6bf8;`;
   }
};

// Play music
const music = new Audio('Moon Landing Countdown.mp3');
music.volume = 0.3;
music.loop = true;

// document.addEventListener('click', musicPlay);
// function musicPlay() {
//    music.play();
//    musicSvg.forEach(svg => svg.classList.toggle('music-playing'));
//    document.removeEventListener('click', musicPlay);
// }

const ToggleMusic = () => {
   if (music.paused) {
      music.play();
   } else {
      music.pause();
   }
};

// Music button fade
const musicButtonFading = () => {
   musicButton.forEach(button =>
      button.classList.add('music-container-transition')
   );
   setTimeout(function () {
      musicButton.forEach(button => {
         button.classList.remove('music-container-transition');
      });
   }, 1000);
};

// Managing movement
const moveLeft = () => {
   // let to = {
   //    x: camera.position.x - 100,
   //    y: camera.position.y,
   //    z: camera.position.z
   // };

   // const tween = new TWEEN.Tween(camera.position)
   //    .to(to, 400)
   //    .easing(TWEEN.Easing.Quadratic.Out)
   //    .start();

   if (state === 'center') {
      pagesWrapper.classList.add('move-right');
      state = 'left';
   } else if (state === 'right') {
      pagesWrapper.classList.remove('move-left');
      state = 'center';
   }
   musicButtonFading();
   setColor();
   setTimeout(() => (centerPage.scrollTop = 0), 600);
};

const moveRight = () => {
   // let to = {
   //    x: camera.position.x + 100,
   //    y: camera.position.y,
   //    z: camera.position.z
   // };

   // const tween = new TWEEN.Tween(camera.position)
   //    .to(to, 400)
   //    .easing(TWEEN.Easing.Quadratic.Out)
   //    .start();

   if (state === 'center') {
      pagesWrapper.classList.add('move-left');
      state = 'right';
   } else if (state === 'left') {
      pagesWrapper.classList.remove('move-right');
      state = 'center';
   }
   musicButtonFading();
   setColor();
   setTimeout(() => (leftPage.scrollTop = 0), 600);
   setTimeout(() => (centerPage.scrollTop = 0), 600);
};

const moveDown = () => {
   // let to = {
   //    x: camera.position.x,
   //    y: camera.position.y,
   //    z: camera.position.z - 50
   // };

   // const tween = new TWEEN.Tween(camera.position)
   //    .to(to, 400)
   //    .easing(TWEEN.Easing.Quadratic.Out)
   //    .start();

   if (state === 'up') {
      pagesWrapper.classList.remove('move-up');
      state = 'center';
   }
   musicButtonFading();
   setColor();
};

const moveUp = () => {
   // let to = {
   //    x: camera.position.x,
   //    y: camera.position.y,
   //    z: camera.position.z + 50
   // };

   // const tween = new TWEEN.Tween(camera.position)
   //    .to(to, 400)
   //    .easing(TWEEN.Easing.Quadratic.Out)
   //    .start();

   if (state === 'center') {
      pagesWrapper.classList.add('move-up');
      state = 'up';
   }
   musicButtonFading();
   setColor();
};

const gifToggle = project => {
   const currentPic = project.src;
   const currentFormat = project.src.split('/projects/')[1].split('.')[1];
   if (currentFormat === 'png') {
      project.src = `${currentPic.slice(0, -3)}gif`;
   } else {
      project.src = `${currentPic.slice(0, -3)}png`;
   }

   project.classList.add('blur');
   setTimeout(() => project.classList.remove('blur'), 300);
};

if (window.innerWidth > 900) {
   VanillaTilt.init(cards, {
      glare: true,
      reverse: true,
      'max-glare': 0.5
   });
   // VanillaTilt.init(glitchText, { reverse: true });
}

projects.forEach(project =>
   project.addEventListener('click', () => gifToggle(project))
);
previews.forEach(button =>
   button.addEventListener('click', () =>
      gifToggle(button.parentNode.parentNode.childNodes[0])
   )
);
leftButton.forEach(button => button.addEventListener('click', moveLeft));
rightButton.forEach(button => button.addEventListener('click', moveRight));
topButton.addEventListener('click', moveUp);
bottomButton.addEventListener('click', moveDown);
goEmail.addEventListener('click', () => {
   moveRight();
   setTimeout(() => moveRight(), 700);
});

copyEmail.addEventListener('click', () => {
   const el = document.createElement('textarea');
   el.value = 'robin_steeman@hotmail.com';
   el.setAttribute('readonly', '');
   el.style.position = 'absolute';
   el.style.left = '-9999px';
   document.body.appendChild(el);
   el.select();
   el.setSelectionRange(0, 99999);
   document.execCommand('copy');
   document.body.removeChild(el);
});

musicButton.forEach(button =>
   button.addEventListener('click', () => {
      musicSvg.forEach(svg => svg.classList.toggle('music-playing'));
      ToggleMusic();
   })
);
