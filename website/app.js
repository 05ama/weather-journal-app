/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
// API key
let apiKey ='&appid=648db84b18934d5b7e80f2375c86893a';
// Base URL
let weatherUrlZip = 'https://api.openweathermap.org/data/2.5/weather?zip=';

//
document.getElementById('generate').addEventListener('click', performAction);


function performAction(e){
    const zip =  document.getElementById('zip').value;
    getWeather(weatherUrlZip, zip, apiKey)
}


const getWeather = async (weatherUrlZip, zip, apiKey)=>{
    const url = weatherUrlZip+zip+apiKey;
    fetch(url)
    .then((response) => response.json())
    .then((data)=> {
        let feelings = document.getElementById('feelings').value;
        postData('/add',{temperature:data.main.temp,
                         date:newDate,
                         userResponse:feelings});
    }).then(()=>{
        fetch('/all').then((res)=>res.json())
        .then((data)=>{console.log(data);})
    })
    .catch(error =>{console.log("error", error);});
  }

const postData = async ( path='' , data ={})=>{
    fetch(path,{
        method:'POST',
        credentials: 'same-origin',
        headers: {
                    'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)}).catch(error =>{console.log("error", error);});
}