"use strict";

window.addEventListener("DOMContentLoaded", start);

// Globals
const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const allStudents = [];

const settings = {
  filter: "all",
};

function start() {
  console.log("ready");
  loadJSON();
}

function registerButtons() {
  // Add event-listeners to filter and sort buttons

  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
}

function loadJSON() {
  fetch(url)
    .then((response) => response.json())
    .then((jsonData) => {
      cleanObjects(jsonData);
    });
}

function cleanObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    // this is a protoype for students
    const Student = {
      image: "",
      firstName: "",
      middleName: "",
      lastName: "",
      nickName: "",
      house: "",
      blood: "",
    };

    // Create new object with cleaned data - and store that in the allStudents array
    const student = Object.create(Student);

    // trim and split the fullname
    const trimmedFullname = jsonObject.fullname.trim().split(" ");

    student.firstName = cleanFirstName(trimmedFullname);
    student.middleName = cleanMiddleName(trimmedFullname);
    student.lastName = cleanLastName(trimmedFullname);
    student.nickName = cleanNickname(trimmedFullname);
    student.house = cleanHouse(jsonObject);
    // student.image = cleanImage(trimmedFullname);

    allStudents.push(student);
  });

  displayCleanStudentList();
}

function cleanFirstName(fullname) {
  return `${fullname[0].charAt(0).toUpperCase()}${fullname[0].slice(1).toLowerCase()}`;
}

function cleanMiddleName(fullname) {
  if (fullname.length <= 2) {
    return `N/a`;
  } else {
    if (fullname[1].includes(`"`) === true) {
      return `N/a`;
    } else {
      return `${fullname[1].charAt(0).toUpperCase()}${fullname[1].slice(1).toLowerCase()}`;
    }
  }
}

function cleanLastName(fullname) {
  if (fullname.length === 1) {
    return `N/A`;
  } else {
    if (fullname[1].includes("-")) {
      let hyphenName = fullname[1].split("-");
      return `${hyphenName[0].charAt(0).toUpperCase()}${hyphenName[0].slice(1).toLowerCase()}-${hyphenName[1].charAt(0).toUpperCase()}${hyphenName[1].slice(1).toLowerCase()}`;
    } else {
      const lastCharacter = fullname[fullname.length - 1];
      return `${lastCharacter.charAt(0).toUpperCase()}${lastCharacter.slice(1).toLowerCase()}`;
    }
  }
}

function cleanNickname(fullname) {
  if (fullname.length === 1) {
    return `N/a`;
  } else if (fullname.length > 1) {
    if (fullname[1].includes(`"`) !== true) {
      return `N/a`;
    } else {
      return `${fullname[1].substring(1, 2).toUpperCase()}${fullname[1].substring(2, fullname[1].lastIndexOf('"')).toLowerCase()}`;
    }
  }
}

function cleanHouse(jsonObject) {
  const trimHouseName = jsonObject.house.trim();
  return `${trimHouseName.charAt(0).toUpperCase()}${trimHouseName.slice(1).toLowerCase()}`;
}

// function cleanImage(fullname) {
//   // a way of getting the last character of fullname string
//   let lastCharacter = fullname[fullname.length - 1];

//   if (fullname.length === 1) {
//     return `N/a`;
//   } else if (fullname[1] === "Patil") {
//     return `${lastCharacter.toLowerCase()}_${fullname[0].toLowerCase()}.png`;
//   } else {
//     if (fullname[1].includes("-")) {
//       let hyphenName = lastCharacter.split("-");
//       return `${hyphenName[hyphenName.length - 1].toLowerCase()}_${fullname[0].charAt(0).toLowerCase()}.png`;
//     } else {
//       return `${lastCharacter.toLowerCase()}_${fullname[0].charAt(0).toLowerCase()}.png`;
//     }
//   }
// }

function selectFilter(event) {
  const filter = event.target.dataset.filter;

  console.log(`User selected ${filter}`);

  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function displayCleanStudentList() {
  // clears the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function buildList(){
  const currentList = filterList(allStudents);
  
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // clone image
  // clone.querySelector("#studentPortrait").src = `images/${student.image}`;

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=nickName]").textContent = student.nickName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  // clone.querySelector("[data-field=blood]").textContent = student.blood;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

console.log(allStudents);
