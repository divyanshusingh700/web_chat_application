let optionsButtons = document.querySelectorAll(".option-button");
let advancedOptionButton = document.querySelectorAll(".adv-option-button");
let fontName = document.getElementById("fontName");
let fontSizeRef = document.getElementById("fontSize");
let writingArea = document.getElementById("msg");
let linkButton = document.getElementById("createLink");
let alignButtons = document.querySelectorAll(".align");
let formatButtons = document.querySelectorAll(".format");
const button = document.querySelector('#emoji-button');
const uploadButton=document.getElementById('uploadButton')
let fileElement = document.getElementById('fileupload')

uploadButton.onclick = () => {

  // check if user had selected a file
  if (fileElement.files.length === 0) {
    alert('please choose a file')
    return
  }

  let file = fileElement.files[0]

  let formData = new FormData();
  formData.set('file', file);

  axios.post("http://localhost:3001/upload-single-file", formData, {
    onUploadProgress: progressEvent => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`upload process: ${percentCompleted}%`);
    }
  })
    .then(res => {
      console.log(res.data)
      console.log(res.data.url)
    })
}
const picker = new EmojiButton();
button.addEventListener('click', () => {
  picker.togglePicker(button);
});
picker.on('emoji', emoji => {
  writingArea.value += emoji;
});

function changeFont(font) {
  let sel = window.getSelection(); 
  // Gets selection
  let x=sel.toString();
  let start=writingArea.value.indexOf(x);
  let end=writingArea.value.indexOf(x)+x.length;
  if (sel.rangeCount) {
    // console.log(font.charAt(0));
    if(font==="bold"){
      let e = document.createElement('b');
      // e.style = 'font-family:' + font.value + ';'; 
      e.innerText +=x;
      txt=e.innerHTML
      writingArea.value=writingArea.value.slice(0,start)+ txt.bold() + writingArea.value.slice(end);
  }
    else if(font==="italic"){
      let e = document.createElement('i');
      // e.style = 'font-family:' + font.value + ';'; 
      e.innerText +=x;
      txt=e.innerHTML
      writingArea.value=writingArea.value.slice(0,start)+ txt.italics() + writingArea.value.slice(end);
  }
  else if(font==="strikethrough"){
    let e = document.createElement(font.charAt(0));
    // e.style = 'font-family:' + font.value + ';'; 
    e.innerText +=x;
    txt=e.innerHTML;
    writingArea.value=writingArea.value.slice(0,start)+ txt.strikethrough() + writingArea.value.slice(end);
  }
}
};


// function myFunction(self,event) {
//   // writingArea.value=writingArea.value.toUpperCase();
//   // bold execute
//   // console.log(writingArea);
//   formatButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//       // myFunction(button.id);
//       // modifyText(button.id, false, null);
//       let id=button.id;
//       // console.log(typeof id);
//       if(id==='bold'){
//         // writingArea.value="";
//         // writingArea.value+=writingArea.value.bold();
//         // this.value=
//         let selection = window.getSelection();
//         selection.toString.bold();
//       }
      
//     })
//   });

//   // if()
// };

// function myFunction(){
  // console.log(self.innerHTML.value);
  // let text=self.innerText;
  // typeof text;
  // writingArea.innerHTML+=self.innerHTML;
  // console.log(writingArea.getAttribute());
  // Div.innerHTML=`<div id ='newMsg'>${self.innerText}</div>`
  // const text=self.innerHTML;
  // let text=tempDivElement.textContent || tempDivElement.innerText || "";
  // console.log(typeof text);
  // console.log(typeof event.key);
  // console.log(tempDivElement);
  // return text;
// } ;

//Initial Settings
const initializer = () => {
  //function calls for highlighting buttons
  //No highlights for link, unlink,lists, undo,redo since they are one time operations
  highlighter(alignButtons, true);
  highlighter(formatButtons, false);
};

//main logic
const modifyText = (command, defaultUi, value) => {
  //execCommand executes command on selected text
  console.log(document.value);
  document.execCommand(command, defaultUi, value);
};
alignButtons.forEach((button) =>{
  button.addEventListener('click',()=>{
    writingArea.style.textAlign='center';
  })
})
//For basic operations which don't need value parameter
optionsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

formatButtons.forEach((button) => {
  button.addEventListener("click", () => {
    console.log(button.id);
    changeFont(button.id);
  });
});

//options that require value parameter (e.g colors, fonts)
advancedOptionButton.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

//link
linkButton.addEventListener("click", () => {
  let userLink = prompt("Enter a URL");
  //if link has http then pass directly else add https
  if (/http/i.test(userLink)) {
    modifyText(linkButton.id, false, userLink);
    
  } else {
    userLink = "http://" + userLink;
    modifyText(linkButton.id, false, userLink);
  }
  writingArea.value+=encodeURIComponent(userLink);
  // let e = document.createElement('a');
  // e.href=userLink;
  // console.log(e)
  // txt=e.innerText;
  // const ele=[e.innerHTML];
  // let st=e.toString();
  // // txt.toString();
  // console.log(st);
  // writingArea.value+="<a href='" + userLink + "'></a>";
});

//Highlight clicked button
const highlighter = (className, needsRemoval) => {
  className.forEach((button) => {
    button.addEventListener("click", () => {
      //needsRemoval = true means only one button should be highlight and other would be normal
      if (needsRemoval) {
        let alreadyActive = false;
        //If currently clicked button is already active
        if (button.classList.contains("active")) {
          alreadyActive = true;
        }
        //Remove highlight from other buttons
        highlighterRemover(className);
        if (!alreadyActive) {
          //highlight clicked button
          button.classList.add("active");
        }
      } else {
        //if other buttons can be highlighted
        button.classList.toggle("active");
      }
    });
  });
};
const highlighterRemover = (className) => {
  className.forEach((button) => {
    button.classList.remove("active");
  });
};

window.onload = initializer();