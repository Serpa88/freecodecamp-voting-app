(function () {
    var pollsListHome = document.querySelector('#polls-list-home') || null;
    var apiUrl = appUrl + '/api/polls';
    
    ajaxFunctions.ready(function () {
        
        if(pollsListHome) {
            ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
                var pollsHTML = '';
                var pollsObject = JSON.parse(data);
                pollsObject.forEach(function (poll) {
                    pollsHTML += `<a href="/polls/${poll._id}">${poll.title}</a>
                    <br/>`;
                });
                pollsListHome.innerHTML = pollsHTML;
            });
        }
        
    });
})();