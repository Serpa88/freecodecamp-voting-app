(function() {
    var pollsListHome = document.querySelector('#polls-list-home') || null;
    var poll = document.getElementById('poll') || null;
    var myPollsElement = document.querySelector('#my-polls') || null;
    var apiUrl = appUrl + '/api/polls';
    var apiUrlPoll = appUrl + '/api' + window.location.pathname;
    var apiUrlMyPolls = appUrl + '/api/polls/me';
    
    ajaxFunctions.ready(function() {

        if (pollsListHome) {
            ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
                var pollsHTML = '';
                var pollsObject = JSON.parse(data);
                pollsObject.forEach(function(poll) {
                    pollsHTML += `<a href="/polls/${poll._id}">${poll.title}</a>
                    <br/>`;
                });
                pollsListHome.innerHTML = pollsHTML;
            });
        }
        if (poll) {
            ajaxFunctions.ajaxRequest('GET', apiUrlPoll, function(data) {
                var pollData = JSON.parse(data);
                var optionsHTML = '';
                for(var i = 0; i < pollData.options.length; i++) {
                    optionsHTML += `<option value="${pollData.options[i][0]}">${pollData.options[i][0]}</option>`;
                }
                poll.innerHTML = `<h3>${pollData.title}</h4>
				<label for="vote">I am voting for:</label>
				<select id="vote">
					<option value="" disabled="disabled" selected="selected" hidden="">Choose an option </option>
					${optionsHTML}
				</select>
				<a target="_blank" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&amp;text=${encodeURIComponent(pollData.title)}%20%7C%20voting-app" class="btn btn-block shareit-twitter-colors tw-share">Share on Twitter</a>
				<form action="/api/polls/vote/new" method="post">
				    Vote on new option: <input type="text" name="option"/>
				    <input type="hidden" name="id" value="${pollData._id}"/>
				</form>`;
                var voteElement = document.getElementById('vote');
                voteElement.onchange = function (elem) {
                    ajaxFunctions.ajaxRequest('POST', appUrl + `/api/polls/vote/${pollData._id}/${elem.target.value}`, function (data) {
                       location.reload();
                    });
                }
                
                google.charts.load('current', { 'packages': ['corechart'] });

                // Set a callback to run when the Google Visualization API is loaded.
                google.charts.setOnLoadCallback(drawChart);

                // Callback that creates and populates a data table,
                // instantiates the pie chart, passes in the data and
                // draws it.
                function drawChart() {

                    // Create the data table.
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Option');
                    data.addColumn('number', 'Voted for');
                    data.addRows(pollData.options);

                    // Set chart options
                    var options = {
                        'width': 400,
                        'height': 300
                    };

                    // Instantiate and draw our chart, passing in some options.
                    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
                    chart.draw(data, options);
                }
            });
        }
        if (myPollsElement) {
            ajaxFunctions.ajaxRequest('GET', apiUrlMyPolls, function(data) {
                var pollsHTML = '';
                var pollsObject = JSON.parse(data);
                pollsObject.forEach(function(poll) {
                    pollsHTML += `<a href="/polls/${poll._id}">${poll.title}</a>
                    <br/>`;
                });
                myPollsElement.innerHTML = pollsHTML;
            });
        }
    });
})();
