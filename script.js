import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {

  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs

} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";



const firebaseConfig = {

  apiKey: "AIzaSyD2ZvVaN_ZWrTKvQdWGpdLyt0jb1FHnVp4",

  authDomain: "cardgame-ed26e.firebaseapp.com",

  projectId: "cardgame-ed26e",

  storageBucket: "cardgame-ed26e.firebasestorage.app",

  messagingSenderId: "830034089374",

  appId: "1:830034089374:web:7c00cf947426a813f8b28f"

};



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);



const cards = [

  "🌸","🌸",
  "🐰","🐰",
  "🍓","🍓"

];



let flippedCards = [];

let score = 0;



function shuffle(array){

  return array.sort(
    () => Math.random() - 0.5
  );

}



async function startGame(){

  const studentId =
    document.getElementById(
      "studentId"
    ).value.trim();



  const name =
    document.getElementById(
      "name"
    ).value.trim();



  if(!studentId || !name){

    alert(
      "학번과 이름을 입력해줘!"
    );

    return;
  }



  // 중복 참여 검사
  const q = query(

    collection(db,"scores"),

    where(
      "studentId",
      "==",
      studentId
    )

  );



  const querySnapshot =
    await getDocs(q);



  if(!querySnapshot.empty){

    alert(
      "이미 참여한 학생이야!"
    );

    return;
  }



  document.getElementById(
    "start-screen"
  ).style.display = "none";



  const gameBoard =
    document.getElementById(
      "game-board"
    );



  gameBoard.innerHTML = "";



  const shuffled =
    shuffle([...cards]);



  shuffled.forEach((emoji)=>{

    const card =
      document.createElement("div");



    card.className = "card";



    card.textContent =
      emoji;



    card.onclick =
      ()=>flipCard(card,emoji);



    gameBoard.appendChild(card);

  });

}



async function flipCard(card,emoji){

  // 이미 열린 카드면 무시
  if(
    card.classList.contains(
      "open"
    )
  ){
    return;
  }



  card.classList.add(
    "open"
  );



  flippedCards.push({
    card,
    emoji
  });



  if(flippedCards.length === 2){

    const first =
      flippedCards[0];



    const second =
      flippedCards[1];



    // 같은 카드면 점수 증가
    if(
      first.emoji ===
      second.emoji
    ){

      score++;

      document.getElementById(
        "score"
      ).textContent = score;

    }



    // 틀려도 안 닫힘
    flippedCards = [];



    // 카드 전부 열렸는지 검사
    const openedCards =
      document.querySelectorAll(
        ".card.open"
      );



    if(openedCards.length === 6){

      const studentId =
        document.getElementById(
          "studentId"
        ).value;



      const name =
        document.getElementById(
          "name"
        ).value;



      // Firebase 저장
      await addDoc(

        collection(db,"scores"),

        {

          name:name,

          studentId:studentId,

          score:score,

          time:new Date()

        }

      );



      setTimeout(()=>{

        alert(

          name +
          "님의 최종 점수는 " +
          score +
          "점입니다!"

        );

      },300);

    }

  }

}



window.startGame = startGame;
