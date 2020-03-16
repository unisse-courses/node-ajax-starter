# Instructions to Complete the Sample
Follow these instructions to be able to complete the data retrieval and display the list and adding a new student to the list through the form.

### Something new...
One key addition in the `index.js` file that you should be able to notice is the new library `body-parser` with its configurations:
```JavaScript
const bodyParser = require('body-parser');

// Configuration for handling API endpoint data
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
```

`body-parser` is an express.js middleware. Read more about it [here](https://expressjs.com/en/resources/middleware/body-parser.html).
> The bodyParser object exposes various factories to create middlewares. All middlewares will populate the req.body property with the parsed body when the Content-Type request header matches the type option, or an empty object ({}) if there was no body to parse, the Content-Type was not matched, or an error occurred.

We need this middleware to be able to parse the objects sent from the client side. This middle ware assists express in decoding the request submitted by the client to the server by matching the `Content-Type` request header (as stated above).

The configurations need to be declared **before** any of the API endpoint declaration to be created.

## (1) GET data from server
If you look back to the slides on Canvas, the **server** is in charge of retrieving the data from the database. For this example, we'll simply be working on some dummy data first which is already in the `index.js` file (our server).

For clients to get data from the server, they usually make use of an [HTTP GET request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET). The server would have to then have a way to accept this request.

#### Server Configuration: `index.js`
Let's configure our server to create a GET API endpoint called `/getStudents`.
1. Go to `index.js` and find this code snippet:
    ```JavaScript
    app.get('/getStudents', function(req, res) {
        // TODO
    });
    ```
2. In the callback function, we need to send the students data through the response object. To do so, we make use of the `res.send()` function where we pass the data object as the argument.
3. In addition to the `send()` function call, we should also send the status code that this response is successful. Add this code to the callback function:
    ```JavaScript
    res.status(200).send(students);
    ```
    The `200 OK` status code tells the client it's a successful call (this is a configuration of the response object). Then it sends the data through the `send()` call.

That's all you need for now on the server.

#### Client Handling: `js/script.js`
In `views/layouts/main.hbs`, you can see `<script src="js/script.js"></script>`. Create the file under the `public` folder and let's build the JavaScript code to be able to make the HTTP GET Request and handle the response from the server.

The first thing we need to look at is the `views/students.hbs` file. At the end of the handlebars template, we have an empty `div` with `id="studentList"`. When using AJAX, we don't fill up the template from the server-side. We fill up the data through a request called from the client once the document has loaded or triggered by an event by the user. This is why we only have an empty template rendered by the server.

To make that data request, we make an HTTP GET call using AJAX.
1. In `js/script.js`, start with the event handler for when the document is ready.
    ```JavaScript
    $(document).ready(function() {
       // Insert the ajax calls here (and all other JS code)
    });
    ```
    **IMPORTANT!**
    > This is a best practice move. Whenever you have any potential DOM selection and manipulation JavaScript or jQuery code **AND** your import `<script>` tag is in the `<head>`, make sure to wrap it inside the event callback function specified above.
    > It makes sure to run your DOM selection **AFTER** the entire document has loaded.
    > Otherwise, your query selectors will return an empty object... instead of the actual HTML elements you wanted to select.

2. Since we want the data to be loaded as soon as the document is ready, we can simply make the AJAX call within the callback function.
    ```JavaScript
    $.get('getStudents', function(data, status) {
        // what to do when the request is successful?
    });
    ```
    Alternatively, we can also use the `$.ajax()` function for additional configurations for error handling. This feels more "complete".
    ```JavaScript
    $.ajax('getStudents', {
        method: 'GET',
        success: function(data, status) {
            // what to do when the request is successful?
        },
        error: function() {
            // what to do when the request fails?
        }
    });
    ```
3. We now ask ourselves, what do we do when the request is successful? Try calling `console.log(data)` in the success function (and then check the console of the browser!)
4. You should have seen an array of objects, which is actually the `students` array sent by the server!
5. We want to display the data in a list. However, we need to loop through the data first.
    ```JavaScript
    data.forEach(function(item, index) {
       // place DOM creation here!
    });
    ```
6. Then we build the DOM for each element in that array. Let's follow the `students.hbs` template we had from the `express-hbs.zip` sample.
    ```HTML
    <div class="row student">
      <div class="col-sm-2 center">
        <img src="{{ this.img }}" />
      </div>
      <div class="col-sm-10">
        <h4>{{this.name}}</h4>
        <p>{{this.id}}</p>
      </div>
    </div>
    ```
    **Quick review of DOM creation**
    1. Create the elements first.
        ```JavaScript
        var rowDiv = document.createElement('div');
        // Create all the other elements too...
        ```
    2. Add the classes.
        ```JavaScript
        // Using the jQuery selector to "reselect" the created div
        // before using the addClass() function from jQuery.
        $(rowDiv).addClass('row student')
        ```
    3. Set the attribute & text.
        ```JavaScript
        $(imgTag).attr(/* get the img field from the data... */);
        $(nameH4).text(/* get the name field from the data... */);
        $(idNumP).text(/* get the id field from the data... */)
        ```
    4. Append the child to the correct parent.
        > **THIS HAS TO BE DONE IN ORDER!**
        > Append the innermost children (`img`, `h4`, `p`) to their parents (`div` with `col` classes) first.
        > Then, append those second level children (`div` with `col` classes) to the main parent (`div` with `row` class).

        ```JavaScript
        $(imgCol).append(imgTag);
        $(nameIdCol).append(nameH4);
        $(nameIdCol).append(idNumP);
        ```
7. At the end you have to make sure to append the `rowCol` div to the container div.
    ```JavaScript
    // place this before the forEach (outside)
    var studentContainer = $('#studentList');

    // place this inside the forEach, last line
    studentContainer.append(rowCol);
    ```
8. Refresh your page and see the results!

## (2) Send data to the server (and display the new addition!)
We have a form ready in the `students.hbs`. We'll use that to get the data from the user and send it to the server (to be stored).

#### Server Handling: `index.js`
Similar to the GET API endpoint, we can first configure what would happen in the server when a client sends some data to the server. Instead of an HTTP GET request, the server should expect an [HTTP POST Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST). This is because (1) we're sending data and (2) we don't want data to be exposed in the URL (like how GET handles it...)

Let's configure our server to create a POST API endpoint called `/addStudent`.
1. Go to `index.js` and find this code snippet:
    ```JavaScript
    app.post('/addStudent', function(req, res) {
        // TODO
    });
    ```
2. In the callback function, we first need to get the data from the client. It's passed through the `req` object. We'll use JSON for our example (this is kind of imposing to the client that we **expect** JSON formatted data). To access the attributes of the object, we need to get it from the `body` of the `req` object.
    ```JavaScript
    app.post('/addStudent', function(req, res) {
        var student = req.body;
    });
    ```
    Because of the `body-parser` middleware from above, this is now automatically converted to a regular JavaScript Object wherein `student` will have whatever attributes was passed from the client.
3. On the server, we can configure what we **expect** the data to be like.
    ```JavaScript
    var student = {
        name: req.body.name,
        id: req.body.idnum,
        img: `img/${req.body.gender}.png`
    };
    ```
    Notice here that the attributes attached to `req.body` are `name`, `idnum` and `gender`. These should be the attributes of the object passed from the client.
4. After creating the object, (assuming it's valid) we can now add this to the existing students data that we have.
    ```JavaScript
    students.push(student);
    ```
5. After which, we still need to send a response back to the client, otherwise, it won't know if the request to add a student has been completed or it failed.
    ```JavaScript
    res.status(200).send(student);
    ```
    Here we're only sending the newly added student. Assuming we have a database connection, the database would more or less return the inserted object or a success message that the data passed was successfully added. This is to minimize the amount of data sent after insertion.

That's all you need for now on the server.

#### Client Handling: `js/script.js`
Now, let's work on completing the client side. We only need to get the data once the user clicks on the `Add Student` button.
```JavaScript
$('#addStudent').click(function() {
    // 1. Get form data
    // 2. Create object to be sent
    // 3. AJAX post method to 'addStudent'
    // 4. Set handling for when the request to add is successful
});
```

1. Get form data. (Code on how to get checked value of radio button referenced from [this post](https://www.tutorialrepublic.com/faq/how-to-get-the-value-of-selected-radio-button-using-jquery.php).)
    ```JavaScript
    var name = $('#name').val();
    var idnum = $('#idnum').val();
    var gender = $("input[name='gender']:checked").val();
    ```
2. Create object to be sent to server.
    ```JavaScript
    var newStudent = {
      name: name,
      idnum: idnum,
      gender: gender
    };
    ```
3. AJAX post call to `addStudent` with the data.
    ```JavaScript
    $.post('addStudent', newStudent, function(data, status) {
        // what to do when the request is successful?
    });
    ```
    Or, you can also use the `$.ajax()` function:
    ```JavaScript
    $.ajax('addStudent', {
        method: 'POST',
        success: function(data, status) {
            // what to do when the request is successful?
        },
        error: function() {
            // what to do when the request fails?
        }
    });
    ```
4. Handle the response when it's successful. This would be similar to when we displayed the list of students, but this time, we only have **one** new item to be displayed. The functionality is the same. So what you can do is take the entire chunk of code inside the `data.forEach` callback, and move that to a separate function above the GET AJAX call.
    ```JavaScript
    function addStudentDiv(item, parentDiv) {
        // Place DOM creation here

        // change the last line to
        parentDiv.append(rowDiv);
    }
    ```

    The content of the `data.forEach` callback would now just be:
    ```JavaScript
    var studentContainer = $('#studentList');

    data.forEach(function(item, index) {
        addStudentDiv(item, studentContainer);
    })
    ```

    The reason for passing the studentContainer element as a parameter is so that we can attach the rowDiv to that parent. Alternatively, you can also choose to return the rowDiv to be appended. (Multiple ways of achieving the same result!)

    So inside the success function for the `$.post()` call, you simply place:
    ```JavaScript
    var studentContainer = $('#studentList');
    addStudentDiv(item, studentContainer);
    ```

And... you're done! Notice that as you keep adding a student, the page does not reload and it's automatically appended at the bottom. If you refresh the page after adding students (without restarting the server), you can still see all the students you added. However, since this is just dummy data and not truly stored in a database (yet!), when you restart the server, you'll be left with what's hardcoded in the starter code.

For any questions or clarifications, post them on the Discussion thread!
