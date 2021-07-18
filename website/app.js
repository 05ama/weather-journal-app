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
    let weatherResponse = await fetch(url);
    try{
        weatherData = await weatherResponse.json();
        let feelings = document.getElementById('feelings').value;
        let postDataResponse = await postData('/add',{
                        temperature:weatherData.main.temp,
                        date:newDate,
                        userResponse:feelings});
        let serverDataResponse = await fetch('/all');
        let serverData = await serverDataResponse.json();
        console.log(serverData);
    }catch(error){
        console.log("error", error);
    }
  }

const postData = async (url= '', data = {})=>{
    const response = await fetch(url,{
                method:'POST',
                credentials: 'same-origin',
                headers: {
                            'Content-Type': 'application/json',
                        },
                body: JSON.stringify(data)})
    try{
        await response.json();
        console.log("Data Posted");       
    }catch(error) {
        console.log("error", error);
    }
}