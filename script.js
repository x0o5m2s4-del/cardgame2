const firebaseConfig = {

  apiKey: "AIzaSyD2ZvVaN_ZWrTKvQdWGpdLyt0jb1FHnVp4",

  authDomain: "cardgame-ed26e.firebaseapp.com",

  projectId: "cardgame-ed26e",

  storageBucket: "cardgame-ed26e.firebasestorage.app",

  messagingSenderId: "830034089374",

  appId: "1:830034089374:web:7c00cf947426a813f8b28f"

};



firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();



const symbols = [

  "🍓","🍓",
  "🐰","🐰",
  "🌸","🌸"

];



let cards = [];

let flipped = [];

let matched = 0;

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
  const snapshot =
    await db.collection("scores")

    .where(
      "studentId",
      "==",
      studentId
    )

    .get();



  if(!snapshot.empty){

    alert(
      "이미 참여한 학생이야!"
    );

    return;

  }



  document.getElementById(
    "start-screen"
  ).style.display = "none";



  document.getElementById(
    "game-screen"
  ).style.display = "block";



  createBoard();

}



function createBoard(){

  const board =
    document.getElementById(
      "game-board"
    );



  board.innerHTML = "";



  cards =
    shuffle([...symbols]);



  cards.forEach((symbol,index)=>{

    const card =
      document.createElement("div");



    card.className =
      "card";



    card.innerHTML = symbol;



    card.dataset.index =
      index;



    card.onclick =
      ()=>flipCard(card,symbol);



    board.appendChild(card);

  });

}



async function flipCard(card,symbol){

  if(
    flipped.includes(card)
  ){
    return;
  }



  flipped.push(card);



  if(flipped.length === 2){

    const first =
      flipped[0];



    const second =
      flipped[1];



    if(
      first.innerHTML ===
      second.innerHTML
    ){

      matched++;

      score++;



      document.getElementById(
        "score"
      ).innerText = score;

    }



    flipped = [];



    if(matched === 3){

      const studentId =
        document.getElementById(
          "studentId"
        ).value;



      const name =
        document.getElementById(
          "name"
        ).value;



      await db.collection("scores")

      .add({

        studentId,

        name,

        score,

        time:new Date()

      });



      setTimeout(()=>{

        alert(
          "게임 완료!"
        );

      },300);

    }

  }

}
