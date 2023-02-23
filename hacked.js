"use strict";

window.addEventListener("DOMContentLoaded", start);

const url = "https://petlatkea.dk/2021/hogwarts/students.json";
const allStudents = [];

function start() {
  console.log("ready");
  loadJSON();
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
      portrait: "",
      firstName: "",
      middleName: "",
      lastName: "",
      nickName: "",
      house: "",
    };
    // Create new object with cleaned data - and store that in the allStudents array
    const student = Object.create(Student);

    const fullname = jsonObject.fullname.trim();

    if (fullname.split(" ").length === 1) {
      student.firstName = fullname;
      student.middleName = "";
      student.lastName = "";
    } else if (fullname.split(" ").length < 3) {
      let firstNameTrim = fullname.substring(0, fullname.indexOf(" "));
      student.firstName = firstNameTrim.charAt(0).toUpperCase() + firstNameTrim.substring(1).toLowerCase();

      let lastNameTrim = fullname.substring(fullname.lastIndexOf(" ") + 1);
        // if (lastNameTrim.includes("-")) {
        //   // del i to og lav begge i uppercase
        //   let separatedLastName = student.lastName.split("-");
        //   console.log(separatedLastName);
        //   student.lastName = separatedLastName[0].charAt(0).toUpperCase() + separatedLastName[0].slice(1).toLowerCase() + separatedLastName[1].charAt(0).toUpperCase() + separatedLastName[1].slice(1).toLowerCase();
        // } else {
      student.lastName = lastNameTrim.charAt(0).toUpperCase() + lastNameTrim.substring(1).toLowerCase();
        // }
    } else {
      //   splitting the string to define first, middle and last name
      let firstNameTrim = fullname.substring(0, fullname.indexOf(" "));
      student.firstName = firstNameTrim.charAt(0).toUpperCase() + firstNameTrim.substring(1).toLowerCase();
      // get last name
      let lastNameTrim = fullname.substring(fullname.lastIndexOf(" ") + 1);
      student.lastName = lastNameTrim.charAt(0).toUpperCase() + lastNameTrim.substring(1).toLowerCase();

      // get nick name
      if (fullname.includes(`\"`)) {
        student.nickName = fullname.substring(fullname.indexOf(`\"`) + 1, fullname.lastIndexOf(`\"`)).trim();
      } else {
        // get middle name
        let middleNameTrim = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
        student.middleName = middleNameTrim.charAt(0).toUpperCase() + middleNameTrim.substring(1).toLowerCase();
      }
    }

    // get house
    let houseTrim = jsonObject.house.trim();

    student.house = houseTrim.charAt(0).toUpperCase() + houseTrim.substring(1).toLowerCase();

    // console.log(Student);

    allStudents.push(student);
  });
  displayCleanStudentList();
}
function displayCleanStudentList() {
  // clears the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
console.log(allStudents);
