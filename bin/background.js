const initialize_timer = (s) => {
  return moment.duration(s, 's');
}

const subtract_seconds = (s, prev_time) => {
  return prev_time.subtract(s, 's');
}

const countdown = (prev_time) => {
  return subtract_seconds(1, prev_time);
}

const send_to_view = (time) => {
  //console.log(time)
  return chrome.runtime.sendMessage({method: "update", body: time }, (err) => {
    if(err) console.log(err);
  });
}

const get_host_url = (url) => {
  const pathArray = url.split( '/' );
  const host = pathArray[2];
  return host;
}

const procrastination_url = (url) => {
  return (url === 'www.youtube.com' || url === 'youtube.com' || url === 'facebook.com' || url === 'www.facebook.com');
}

const get_active_tab = () => {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true}, (tab) => {

      return resolve(tab[0]);
    });
  });
}

const purge_view = () => {
  let view = document.getElementsByTagName("body")[0];
  view.innerHTML = "<h1>Boiiii</h1>";
}

const end_session = () => {
  purge_view();
  return send_to_view(`Time's up. go work, Boiiiiiii! Come back in 2 hrs or so idk`);
}

const decrement_time = (remaining_time) => {
  let current_time = countdown(remaining_time);
  
  if(current_time.as('seconds') <= 0) return end_session();
  
  let current_minutes = current_time.get('m');
  let current_seconds = current_time.get('s');
  //format seconds to look like a clock
  if(current_seconds < 10)
    current_seconds = `0${current_seconds}`;

  return send_to_view(`${current_minutes}:${current_seconds}`);
}

const tick_action = async (remaining_time) => {

  const active_tab = await get_active_tab();
  const host_url = get_host_url(active_tab.url);
  if(procrastination_url(host_url)) return decrement_time(remaining_time);
  //non-procrastination
  return send_to_view(`This website is (probably) clear, enjoy!`);     
}

const start = () => {
  //set 20 minutes
  let remaining_time = initialize_timer(5);
  //start timer
  let timer = setInterval(() => { tick_action(remaining_time) }, 1000);
}

start();