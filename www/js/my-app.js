// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    createFile();
    getPosition();
    openCage();
    getCurrencyRate();
});

myApp.onPageInit('index', function (page) {
  getPosition();
openCage();
getCurrencyRate();
  
})


// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
       // myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
})



function insert(num){ //validation for the selected field
    var input = document.getElementById('1stAmt');
    if(!input) //if not input anything, it returns nothing
      return;
  
    var newValue = input.innerHTML + num;
    var re = /^[0-9]+\.?[0-9]*$/;  //set the rule for RegExp in JS
    var valid = re.test( newValue );
    if(valid){
      input.innerHTML = newValue;
      cal();
    }
      
  }
  
  function clean(){
    var input = document.getElementById('1stAmt');
    input.innerHTML="";
    document.getElementById('2ndAmt').innerHTML="";
  }
  
  function back(){
    var input = document.getElementById('1stAmt');
    var exp=input.innerHTML
    input.innerHTML=exp.substring(0,exp.length-1)
    var newValue = input.innerHTML;
    var re = /^[0-9]+\.?[0-9]*$/;  //set the rule for RegExp in JS
    var valid = re.test( newValue );
    if(valid){
      input.innerHTML = newValue;
      cal();
    }
  }
  
  function preventKeyInput(event){
    event.preventDefault();
  }


  function initMap(lat, lng) {
    var position = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map'),
                                  { zoom: 4,
                                   center: position
                                  });  
    var marker = new google.maps.Marker(
        {position: position,
         map: map}
    );
}

var currentLatitude = 53.346; //default
var currentLongitude = -6.2588; //default
function getPosition(setCurrentLocationOnMap) {
    var options = {
       enableHighAccuracy: true,
       maximumAge: 3600000
    }
    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
 
    function onSuccess(position) {
        var currentLatitude = position.coords.latitude;
        var currentLongitude = position.coords.longitude;
        
       console.log('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');

          if(setCurrentLocationOnMap)
            initMap(position.coords.latitude, position.coords.longitude);
    };
 
    function onError(error) {
       alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
 }

var currentCurrencyCode = 'EUR';//default
var currentCity = 'Dublin';
var currentCountry = 'Ireland';
var savedCurrency = false;
 function openCage(){

    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // here some value of Latituted and longitude for the API 
    // to process
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=' + currentLatitude + ',' + currentLongitude + '&key=4ccf31a03a2e451aaa34928f65885cb8';
    // Opening the request. Remember, we will send
    // a "GET" request to the URL define above
    http.open("GET", url);
    // Sending the request
    http.send();

    // Once the request has been processed and we have
    // and answer, we can do something with it
    http.onload = function() {
      if (http.status == 200){ 
        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response); 
    
        // Printing the result JSON to the console
        console.log(responseJSON);

        // Extracting the individual values, just as we
        // do with any JSON object. Just as we did 
        // with the position.
        // REMEMBER: In this case, we have an array inside 
        // the JSON object.
        var city = responseJSON.results[0].components.city;
        currentCity = city;
        var country = responseJSON.results[0].components.country;
        currentCountry = country;
        var currency = responseJSON.results[0].annotations.currency.name;
        currentCurrencyCode = responseJSON.results[0].annotations.currency.iso_code;
        var flag = responseJSON.results[0].annotations.flag;
        //JSON plain text <--> JS object

      

        // Formattng data to put it on the front end
        var oc = "Welcome to " + city + ", " + country + " " + flag +  "<br>Local Currency: " + currency;

        // Placing formatted data on the front end
        document.getElementById('welcome-message').innerHTML = '<p>' + oc + '</p>';
        document.querySelector('select#currency1').value = currentCurrencyCode;

        if(!savedCurrency){
          saveFile('You visited ' + currentCity + ' in ' + currentCountry + ' where using ' + currency + '<br>');
          savedCurrency = true;  
        }
      }else{
        console.log("server error");
      }
        
        
    }
    
}


// Now we need to run the code that will be executed only for About page.




// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('map', function (page) {
    // Do something here for "about" page
    getPosition(true);
    getWeather(currentCity);
    
})

myApp.onPageInit('diary', function (page) {
  // Do something here for "about" page
readFile(document.getElementById('journey'));
  
})

var rateData;
function getCurrencyRate(){

/*   var from = document.getElementById('from').value;
  var to = document.getElementById('to').value;
  var amount = parseInt(document.getElementById('amount').value); */
  
  var request_url = 'http://apilayer.net/api/live?access_key=5f93196f90551a96e74997ef59c6a9d0'



  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {


    if (request.status == 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      console.log(data);
      rateData = data;
      
/*       var fromRate = data.quotes['USD' + from];
      var toRate = data.quotes['USD' + to];
      var convertRate = toRate / fromRate;
      var exchanged = amount * convertRate;
      document.getElementById('result').value = exchanged; */


    
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
                             
  }

  function cal(){
    var from = document.getElementById('currency1').value;
    var to = document.getElementById('currency2').value;
    var amount = parseFloat(document.getElementById('1stAmt').innerHTML);
    if(from && to && amount){
      var fromRate = rateData.quotes['USD' + from];
      var toRate = rateData.quotes['USD' + to];
      var convertRate = toRate / fromRate;
      var exchanged = amount * convertRate;
      document.getElementById('2ndAmt').innerHTML = exchanged.toFixed(2); 
    }

  }

  var weatherData;
  var savedWeather = false;
  function getWeather(location) {  
      var request_url = 'http://api.apixu.com/v1/forecast.json?key=c2f9ab12f8894cbdbb7224658190405&q=' + location;
  
      var request = new XMLHttpRequest();
      request.open('GET', request_url, true);
    
      request.onload = function() {

        if (request.status == 200){ 
          // Success!
          var data = JSON.parse(request.responseText);
          console.log(data);
          weatherData = data;
          var html = '<h3>' + 'Weather of ' + location + '</h3>' + ' <br>'
          + weatherData.current.condition.text + '<img src="http:' + weatherData.current.condition.icon + '">'
          + '<br><br>Temperature: ' + weatherData.current.temp_c + 'C&deg;'
          + '<br><br>Temperature feels like: ' + weatherData.current.feelslike_c + 'C&deg;' 
          + '<br><br>Max temperature: ' + weatherData.forecast.forecastday[0].day.maxtemp_c + 'C&deg;' 
          + '<br><br>Min temperature: ' + weatherData.forecast.forecastday[0].day.mintemp_c + 'C&deg;' 

          document.getElementById('weather').innerHTML = html;
          if(!savedWeather){
            saveFile('The weather was ' + weatherData.current.condition.text + ' and the temperature was ' + weatherData.current.temp_c + 'C&deg;<br>');
            savedWeather = true;
          }
          
    
        } else {
          console.log("server error");
        }
      };
    
      request.onerror = function() {
        // There was a connection error of some sort
        console.log("unable to connect to server");        
      };
    
      request.send();  // make the request
                                 
    }

function errorLogger(error){
  console.log(error);
}

function saveDate(){
  var date = new Date().toDateString();
  var time = new Date().toLocaleTimeString();
  saveFile("<h3>" + date + " " + time + "</h3>");
}

function createFile(){
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    console.log('file system open: ' + fs.name);
    fs.root.getFile("travelpal.json", { create: true, exclusive: true }, function (fileEntry) {

        console.log("fileEntry is file?" + fileEntry.isFile.toString());
        saveDate();
    }, saveDate);

}, errorLogger);
}


function saveFile(dataObj){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

      console.log('file system open: ' + fs.name);
      fs.root.getFile("travelpal.json", { create: false, exclusive: false }, function (fileEntry) {

          console.log("fileEntry is file?" + fileEntry.isFile.toString());
 
          writeFile(fileEntry, dataObj);

      }, errorLogger);

  }, errorLogger);
}
    

  function writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }

        try {
          fileWriter.seek(fileWriter.length);
        }
        catch (e) {
            console.log("file doesn't exist!");
        }
        fileWriter.write(dataObj);
    });
}

function readFile(displayBlk) {
  
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

    console.log('file system open: ' + fs.name);
    fs.root.getFile("travelpal.json", { create: false, exclusive: false }, function (fileEntry) {

        console.log("fileEntry is file?" + fileEntry.isFile.toString());

        fileEntry.file(function (file) {
          var reader = new FileReader();
    
          reader.onloadend = function() {
              console.log("Successful file read: " + this.result);
              
              if(displayBlk)
              displayBlk.innerHTML = this.result;
          };
    
          reader.readAsText(file);
    
      }, errorLogger);

    }, errorLogger);

}, errorLogger);


}

var zomatoData;
function getZomato(location){
  var request_url = 'https://developers.zomato.com/api/v2.1/locations?query=' + location;
  
  var request = new XMLHttpRequest();
  
  request.open('GET', request_url, true);
  request.setRequestHeader('user-key', '871b8a6d0365d042266fbf2d20c4c98e');
  request.onload = function() {

    if (request.status == 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      console.log(data);
      zomatoData = data;

      var html = '<div class="widget_wrap" style="width:320px;height:797px;display:inline-block;"><iframe src="https://www.zomato.com/widgets/res_search_widget.php?city_id=' + zomatoData.location_suggestions[0].city_id + '&theme=red&hideCitySearch=on&hideResSearch=on&sort=popularity" style="position:relative;width:100%;height:100%;" border="0" frameborder="0"></iframe></div>';
      document.getElementById('nearby-food').innerHTML = html;
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
}

myApp.onPageInit('food', function (page) {
  getZomato(currentCity);
  
})

var placeData;
function getPlace(lat, lng){
  
  var request_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng+ '&radius=1500&key=AIzaSyCfPNyHO4zCEJAw6EoYcxcGA44OIgBZjOI';
  
  var imgUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=330&key=AIzaSyCfPNyHO4zCEJAw6EoYcxcGA44OIgBZjOI';

  var request = new XMLHttpRequest();
  
  request.open('GET', request_url, true)
  request.onload = function() {

    if (request.status == 200){ 
      // Success!
      var data = JSON.parse(request.responseText);
      console.log(data);
      placeData = data;
  
      var html = '';
      for(var i = 0; i < 5 && i < data.results.length; i++){
        html += '<h2>' + data.results[i].name + '</h2>';
        html += '<img src="' + imgUrl + '&photoreference=' + data.results[i].photos[0].photo_reference + '"><br>';
      }
      
      document.getElementById('nearby-places').innerHTML = html;
    
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");        
  };

  request.send();  // make the request
}

myApp.onPageInit('place', function (page) {
  getPlace(currentLatitude, currentLongitude);
  
})