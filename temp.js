let city = document.querySelector('.city_name');
let search_city=document.querySelector('.search')
let daysContainer = document.querySelector('.day5'); // Get the element with class .5day
let hourContainer = document.querySelector('.hour5');
let time;

search_city.addEventListener('click',async()=>{
  let cityy = city.value.trim();  // Get user input
  daysContainer.innerHTML='';
  hourContainer.innerHTML='';
  if (!cityy) { // Prevent empty input
    console.error("City name is empty!");
    return;
  }
    console.log("City entered:", cityy);

    // Fetch weather data only after the user enters the city name
    let data = await fetchData(cityy);
    // console.log(data);
    await main(data);
  })

city.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {  // Wait for the user to press Enter
    let cityy = city.value.trim();  // Get user input
    daysContainer.innerHTML='';
    hourContainer.innerHTML='';
    if (!cityy) { // Prevent empty input
      console.error("City name is empty!");
      return;
    }

    console.log("City entered:", cityy);

    // Fetch weather data only after the user enters the city name
    let data = await fetchData(cityy);
    // console.log(data);
    await main(data);
  }
});

async function chalo() {
  let a=await fetchData('maharashtra');
  await main(a);
}

async function fetchData(cityy) {
  try {
    let res = await fetch(`https://api.weatherapi.com/v1/current.json?key=e7adf9952dc040049ea70053251003&q=${cityy}&aqi=yes`);
    
    if (!res.ok) {  
      throw new Error(`API error: ${res.status} - ${res.statusText}`);
    }

    let data = await res.json();
    await fetchData1(cityy);

    return data;
  } catch (error) {
    alert('Please Provide Valid City Name')
    console.error('Error fetching data:', error);
    
  }
}
async function fetchData1(cityname) {
  try {
         let res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=7558760060b43c7b8805cc83f755f6f5`);
        if (!res.ok) 
      {  
        throw new Error(`API error: ${res.status} - ${res.statusText}`);
      }
        let [data] = await res.json();
        // console.log(data);

        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=7558760060b43c7b8805cc83f755f6f5`);
        
        let data2= await response.json();
        console.log(data2)
        
        let temp_data;
        let date;
        let days='';
// Extract 5-day data by filtering for a specific time (e.g., 12:00 PM)
const dailyData = data2.list.filter(item => item.dt_txt.includes("12:00:00"));

if (dailyData.length > 0) {

    if (daysContainer) {
        dailyData.forEach(item => {
            const weatherDescription = item.weather[0].description;
            const icon = item.weather[0].icon; // Save the img by this icon value
            temp_data = item.main.temp - 273.15; // Convert to Celsius
            date = item.dt_txt.split(" ")[0]; // Get date only

            console.log(`Icon:${icon}, Temp: ${temp_data.toFixed(2)}°C, Date: ${date}, Weather: ${weatherDescription}`);

            daysContainer.innerHTML += `
                <div class="d-flex justify-content-between align-items-center">
                    <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${weatherDescription}">
                    <p>${temp_data.toFixed(2)}&degC</p>
                    <p>${date_String(date)}</p>
                </div>
            `;
        });
    } else {
        console.error("Element with class '.5day' not found.");
    }
} else {
    console.error("No data found for 12:00 PM.");
}


      //  Hourly data
      if (data2.list && data2.list.length > 0) {
        // Extract the first 5 elements
        const firstFiveElements = data2.list.slice(0, 4);
        // Process and log data for each element
        const processedData = firstFiveElements.map(item => {
          const dateTime = item.dt_txt.split(" ")[1]; // Date and time

          const temperature = item.main.temp - 273.15
          const weatherDescription = item.weather[0].description; // Weather description
          const icon = item.weather[0].icon; // Weather icon
  
          console.log(`Time: ${dateTime}, Temp: ${temperature},Weather: ${weatherDescription}, Icon: ${icon}`);
          // Return processed data object
          hourContainer.innerHTML+=
          `
          <div class="col-3 text-center">
          <h3 class="text-center ">${time_String(dateTime)}</h3>
          <span class="feel_temp"><img src="http://openweathermap.org/img/wn/${icon}.png" alt=""></span>
          <p class="text-center">${temperature.toFixed(2)}&degC</p>
          </div>
          `
          return { dateTime, temperature, weatherDescription, icon };
        });

          // console.log("Processed Data:", processedData);
      } 
      else 
      {
          console.log("No data available in the list.");
      }
  
      function timestamp(time)
      {
        const date = new Date(time * 1000); // Multiply by 1000 to convert seconds to milliseconds
        // If you want a local date and time: 
        const localDate = date.toLocaleString();
        
        console.log(`Readable Date in Local Time: ${localDate}`);
        return localDate;
      }
      
      let a=data2.city.sunrise
      let b=data2.city.sunset
      let rise=await timestamp(a)
      let set=await timestamp(b)
      console.log(rise); 

      document.querySelector('.rise').innerHTML=rise.split(" ")[1]
      document.querySelector('.set').innerHTML=set.split(" ")[1]
      // console.log("Sunrise",rise)
      // console.log("Sunset",set)
  } 
  catch (error) 
  {
    console.error('Error fetching data:', error);
  }
  
}
    
    
    async function main(a) {
      // let a = await fetchData();
      console.log(a); // Now 'a' contains the actual fetched data

      
      document.querySelector('.city').innerHTML=`${a.location.name}`
      let local= a.location.localtime
      let[date,time]=local.split(" ")
      document.querySelector('.time').innerHTML=`${time}`
      document.querySelector('.day').innerHTML=`${date_String(date)}`
      document.querySelector('.temp').innerHTML=`${a.current.temp_c}&deg`
      document.querySelector('.feel_temp').innerHTML=`Feels like ${a.current.feelslike_c}&degC`
      document.querySelector('.weatherImg').innerHTML=`<img src="${a.current.condition.icon}" alt="">
      <span class="text-center">${a.current.condition.text}</span>`
      document.querySelector('.humidity').innerHTML=`${a.current.humidity}`
      document.querySelector('.wind').innerHTML=`${a.current.wind_kph}`
      document.querySelector('.pressure').innerHTML=`${a.current.pressure_in}`
      document.querySelector('.uv').innerHTML=`${a.current.uv}`
      
    }
    
  

chalo();

function time_String(time)
{
  let result= time.substring(0,5)
  return result
}

function date_String(date)
{
   let result= date.split("-").reverse().join("-");
   return result;
}

let b=date_String('2025-09-19')
console.log(b)

let a= time_String('15:00:34')
console.log(a)

let radio= document.querySelector('.checkin')

let mode=document.querySelector('.mode')
radio.addEventListener('click',()=>{
  if(radio.dataset.val==='one')
  {
      document.body.style.background='#f4f3ee'
      radio.dataset.val='two'
      mode.innerText='Dark Mode'
    }
    else
    {
      document.body.style.background='rgb(76, 77, 77)'
      radio.dataset.val='one';
      mode.innerText='Light Mode'
  }
})


function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  let lat=position.coords.latitude;
  let lon=position.coords.longitude;
  let data={lat,lom}
  console.log(data)
  return data;
  // document.getElementById("location").innerHTML = 
  // "Latitude: " + position.coords.latitude + 
  // "<br>Longitude: " + position.coords.longitude;
}
