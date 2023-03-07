"use strict";

window.addEventListener("DOMContentLoaded", start);

// Global variables
const urlList = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlBlood = "https://petlatkea.dk/2021/hogwarts/families.json";

let allStudents = [];
let expelledList = [];
let bloodHistory = [];

// Object for filter, sort and search
const settings = {
  filterBy: "all",
  filterType: "all",
  sortBy: "studentId",
  sortDir: "asc",
  search: "",
};

// start function

async function start() {
  console.log("start function running");
  const studentList = await getData(urlList);
  // const bloodList = await getData(urlBlood);

  allStudents = studentList.map(cleanUpData);
  //  buildList();
  //  regBtn();
}

async function getData(url) {
  const response = await fetch(url);
  const jsonData = await response.json();
  return jsonData;
}

function cleanUpData(studentList, i) {
  // student object
  const Student = {
    studentId: null,
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    gender: "",
    imgSrc: "",
    house: "",
    blood: "",
    prefect: false,
    expelled: false,
    inqSquad: false,
  };

  const student = Object.create(Student);

  // Variable holding data + trim spaces
  let house = studentList.house.trim();
  let gender = studentList.gender.trim();
  let fullName = studentList.fullname.trim();

  // set student Id number
  student.studentId = i + 1;

  // Firstname, first char toUpperCase, rest toLowerCase
  if (fullName.includes(" ")) {
    student.firstName = fullName.substring(0, 1).toUpperCase() + fullName.substring(1, fullName.indexOf(" ")).toLowerCase();
  } else {
    student.firstName = fullName.substring(0, 1).toUpperCase() + fullName.substring(1).toLowerCase();
  }

  // Lastname, first char toUpperCase, rest toLowerCase
  if (fullName.includes(" ")) {
    student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2).toUpperCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase();
  }

  // Middlename, first char toUpperCase, rest toLowerCase
  student.middleName = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "));
  student.middleName = student.middleName.substring(0, 1).toUpperCase() + student.middleName.substring(1).toLowerCase();

  // find nickname with ""
  if (fullName.includes(`"`)) {
    student.middleName = "";
    student.nickName = fullName.substring(fullName.indexOf(`"`), fullName.lastIndexOf(`"`) + 1);
  }

  // Gender, first char toUpperCase, rest toLowerCase
  student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

  // find img destination and lowercase all
  let imgSrcHolder;
  if (fullName.includes("-")) {
    imgSrcHolder = `./pictures/${fullName.substring(fullName.lastIndexOf("-") + 1).toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
  } else if (!fullName.includes(" ")) {
    imgSrcHolder = `./pictures/no_picture.png`;
  } else if (fullName.toLowerCase().includes("patil")) {
    if (fullName.toLowerCase().includes("padma")) {
      imgSrcHolder = "./pictures/patil_padma.png";
    } else if (fullName.toLowerCase().includes("parvati")) imgSrcHolder = "./assets/images/students_img/patil_parvati.png";
  } else {
    imgSrcHolder = `./pictures/${fullName.substring(fullName.lastIndexOf(" ") + 1).toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
  }
  student.imgSrc = imgSrcHolder;

  student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

  student.gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();
  // console.log(student);
  return student;
}

function displayList(students) {
  // clear the list
  document.querySelector("#student_list").innerHTML = "";

  // // count students
  // const studentCounted = studentCounter(students);
  // displayCount(studentCounted);

  // build new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=fullname]").textContent = `${student.firstName} ${student.nickName} ${student.middleName} ${student.lastName}`;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=student_img]").src = student.imgSrc;
  clone.querySelector("[data-field=student_img]").alt = `Picture of ${student.firstName} ${student.lastName}`;
  clone.querySelector(".student_id").textContent = `Id: ${student.studentId}`;

  //  House color and crests
  const studCont = clone.querySelector(".student_container");
  const badgesCrest = clone.querySelector(`[data-field=crest]`);
  if (student.house === "Gryffindor") {
    studCont.style.borderColor = "#9c1203";
    badgesCrest.src = "house_crests/gryffindor.png";
  } else if (student.house === "Slytherin") {
    studCont.style.borderColor = "#033807";
    badgesCrest.src = "house_crests/slytherin.png";
  } else if (student.house === "Hufflepuff") {
    studCont.style.borderColor = "#e3a000";
    badgesCrest.src = "house_crests/hufflepuff.png";
  } else if (student.house === "Ravenclaw") {
    studCont.style.borderColor = "#00165e";
    badgesCrest.src = "house_crests/ravenclaw.png";
  }
  //append
  document.querySelector("#student_list").appendChild(clone);
}
