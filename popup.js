//set time in view
(() => {
  chrome.runtime.onMessage.addListener(function(message, sender, sendRepsonse){
    if(message.method !== 'update')
      return sendResponse('Error in understanding the message ;(');

    const timer_elem = document.getElementById('timer');
    timer_elem.innerHTML = message.body;
  });
})();