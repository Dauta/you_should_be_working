function initialize_timer(){
  return moment.duration(20, 'm');
}

function countdown(prev_time){
  return prev_time.subtract(1, 's');
}

function send_to_view(time){
  //console.log(time)
  chrome.runtime.sendMessage({method: "update", body: time }, function(err){
    if(err)
      console.log(err);
  });
}

function get_host_url(url){
  var pathArray = url.split( '/' );
  var host = pathArray[2];
  return host;
}

function start_timer(){
  //set 20 minutes
  let time_left = initialize_timer();
  //start timer
  let timer = setInterval(function(){

    chrome.tabs.query({active: true}, function(tab){
      //get url
      let url = get_host_url(tab[0].url);
      //check
      if(url === 'www.youtube.com' || url === 'youtube.com'){
        //decrement remaining time
        let current_time = countdown(time_left);
        
        if(current_time.as('seconds') > 0){
          let current_minutes = current_time.get('m');
          let current_seconds = current_time.get('s');
          //format seconds to look like a clock
          if(current_seconds < 10)
            current_seconds = `0${current_seconds}`;
          //send to pop-up  
          send_to_view(`${current_minutes}:${current_seconds}`);   
        }
        else {
          send_to_view(`Time's up, go work! BITCH!`);             
        }
      }
      else
        send_to_view(`This website is clear, enjoy!`);          
    });
  },1000);
}

start_timer();