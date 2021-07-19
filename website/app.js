/* Global Variables */
let serverData = {}; // variable to save latest fetched data from server

const E0 = "No valid Entries yet";          // Error message for invalid inputs
const E1 = "Server data saving error";      // Error message for data saving to server issue
const E2 = "Server data recovery error";    // Error message for data fetching from server issue
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'/'+ d.getDate()+'/'+ d.getFullYear();
// API key
const apiKey ='&appid=648db84b18934d5b7e80f2375c86893a&units=metric'; //In Celcius
// Base URL
let weatherUrlZip = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// Add listening event to start the sequence
document.getElementById('generate').addEventListener('click', performAction);

/**
 * @description : extract zip code and intiate weather api request
 * @param {*} e : click event
 * @returns : None
 */
function performAction(e){
    const zip =  document.getElementById('zip').value;  // extract Zip code
    getWeather(weatherUrlZip, zip, apiKey) // retrieve data from weather api
}


/**
 * @description : Request data from weather api and initiate data saving/recovery to/from server
 * @param {*} weatherUrlZip : URL for weather api using zip code
 * @param {*} zip : Entered zip code by the user
 * @param {*} apiKey : weather api key
 * @returns : None
 */
const getWeather = async (weatherUrlZip, zip, apiKey)=>{
    const url = weatherUrlZip+zip+apiKey;                           // construct URL
    let weatherResponse = await fetch(url);                         // wait for fetching the data from api url
    try{                                                            // try/catch errors
        weatherData = await weatherResponse.json();                 // parse the response
        let feelings = document.getElementById('feelings').value;   // extract user input data
        let postDataResponse = await postData('/add',{              // post data to the server
                        temperature:weatherData.main.temp,          // sending data object to the server
                        date:newDate,
                        userResponse:feelings});
        await uiUpdate();                                           // update the html page
    }catch(error){
        alert(E0);                                                  // alert error
        uiErrorUpdate();                                            // update html page according to the default error case
        console.log("Weather response parsing error");              // console log for debug
        console.log("error", error);                                // log any errors
    }
  }
/**
 * @description : POST data request to server
 * @param {*} url : server route
 * @param {*} data : data to be saved :{temperature,date,userResponse}
 * @returns : None
 */
const postData = async (url= '', data = {})=>{
    const response = await fetch(url,{                              // wait for fetch response
                method:'POST',                                      // this is a POST
                credentials: 'same-origin',                         // credentials: 'same-origin'
                headers: {                                          // 'Content-Type': 'application/json'
                            'Content-Type': 'application/json',
                        },
                body: JSON.stringify(data)})                        // body should match the content type
    try{                                                            // try/catch errors
        await response.json();                                      // wait for response parsing
        console.log("Data Posted");                                 // log to console info for debugging
    }catch(error) {
        alert(E1);                                                  // alert error
        uiErrorUpdate();                                            // update html page according to the default error case
        console.log("Server POST data parsing error");              // console log for debug
        console.log("error", error);                                // log any errors
    }
}


/**
 * @description : GET data request to server
 * @param  : None
 * @returns : None
 */
const uiUpdate = async ()=>{
    let serverDataResponse = await fetch('/all');                       // wait for fetch response, This a get request by default
    try{                                                                // try/catch errors
        serverData = await serverDataResponse.json();                   // wait for response parsing
        document.getElementById('date').innerHTML = `<p>Date: ${serverData.date}</p>`;                   // update date
        document.getElementById('temp').innerHTML = `<p>Temperature: ${serverData.temperature} &#8451</p>`;     // update temprature in celcius
        document.getElementById('content').innerHTML = `<p>${serverData.userResponse.replace(/\r\n|\n|\r/gm, '<br />')}</p>`; // update user content with the same format
        document.getElementsByClassName("holder entry")[0].style.display ="inline-block";               // display holder entery div
        document.getElementById('app').style.height = "auto";                                           // update window height
        console.log(serverData);                                                                        // log data to console for debug
    }catch(error){
        alert(E2);                                                  // alert error
        uiErrorUpdate(E2);                                          // update html page according to Fetch error case, No need to re request GET
        console.log("Server GET data parsing error");               // console log for debug
        console.log("error", error);                                // log any errors
    }
}


/**
 * @description : update html page according to error state/case
 * @param {*} errorStage : Error case
 * @returns : None
 */
const uiErrorUpdate = async( errorStage = "")=>{  
    switch (errorStage){
        case E2:   // Error is in GET data request from the server, don't request again and display the latest current saved data
            if (Object.keys(serverData).length > 0){        // check is there any saved data
                document.getElementById('date').innerHTML = `<p>Date: ${serverData.date}</p>`;                   // update date
                document.getElementById('temp').innerHTML = `<p>Temperature: ${serverData.temperature} &#8451</p>`;     // update temprature in celcius
                document.getElementById('content').innerHTML = `<p>${serverData.userResponse.replace(/\r\n|\n|\r/gm, '<br />')}</p>`; // update user content with the same format    
                document.getElementsByClassName("holder entry")[0].style.display ="inline-block";               // display holder entery div
                document.getElementById('app').style.height = "auto";                                           // update window height
                break;
            }else{
                document.getElementById('date').innerHTML = "";
                document.getElementById('date').innerText = E2;
                document.getElementById('temp').innerHTML = ""
                document.getElementById('content').innerHTML = ""  
                document.getElementsByClassName("holder entry")[0].style.display ="inline-block";               // display holder entery div
                document.getElementById('app').style.height = "auto";                                           // update window height
            }
        default:    
            let serverDataResponse = await fetch('/all');                 // Error in any other step except E2
            try{
                serverData = await serverDataResponse.json();  
                document.getElementById('date').innerHTML = `<p>Date: ${serverData.date}</p>`;                   // update date
                document.getElementById('temp').innerHTML = `<p>Temperature: ${serverData.temperature} &#8451</p>`;     // update temprature celcius
                document.getElementById('content').innerHTML = `<p>${serverData.userResponse.replace(/\r\n|\n|\r/gm, '<br />')}</p>`; // update user content with the same format    
                document.getElementsByClassName("holder entry")[0].style.display ="inline-block";                // display holder entery div
                document.getElementById('app').style.height = "auto";                                            // update window height
            }catch{
                alert(E2);                                                  // alert error
                uiErrorUpdate(E2);                                          // update html page according to Fetch error case, No need to re request GET
                console.log("Server GET data parsing error");               // console log for debug
                console.log("error", error);                                // log any errors
            }
        break;
    } 
}